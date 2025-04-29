import sgMail from "@sendgrid/mail";
import { configs } from "configs.js";
import { StatusCodes } from "http-status-codes";
import { prisma } from "prisma/client.prisma.js";
import { ErrorUtil } from "utils/error.util.js";
import { AuthcodeEmail } from "../assets/authcode.template.js";
import { CryptUtil } from "../utils/crypt.util.js";
import { TimeUtil } from "../utils/time.util.js";
import { ValidUtil } from "../utils/valid.util.js";

export namespace AuthService {
	export async function sendAuthcode(data: {
		uid: string;
		email: string;
		name: string;
	}): Promise<void> {
		const uid = BigInt(data.uid);

		try {
			await prisma.authcode.delete({ where: { uid }, select: { uid: true } });
		} catch {}

		const code = CryptUtil.randomDecCode(6);
		const salt = CryptUtil.randomBytes(16);
		const hash = CryptUtil.hash(code, salt);
		await prisma.authcode.create({
			data: { uid, hash, salt, created: 0 },
			select: { uid: true },
		});

		sgMail.setApiKey(configs.auth.sgApiKey);
		try {
			await sgMail.send({
				from: configs.auth.sgSender,
				to: data.email,
				subject: `${code} - Assignee Authcode`,
				html: AuthcodeEmail({
					name: data.name,
					code,
					expiry: configs.auth.authcodeExpiryMin,
				}),
			});
		} catch {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.SERVICE_UNAVAILABLE,
				`SendGrid service failed to send authcode to ${data.email}.`,
			);
		}
	}

	export async function isAuthcodeValid(data: {
		uid: string;
		authcode: string;
	}): Promise<boolean> {
		const uid = BigInt(data.uid);

		const authcode = await prisma.authcode.findUnique({ where: { uid } });
		if (!authcode) return false;

		const isExpired = TimeUtil.isExpired(authcode.created, {
			min: configs.auth.authcodeExpiryMin,
		});
		if (isExpired) {
			await prisma.authcode.delete({
				where: { uid: authcode.uid },
				select: { uid: true },
			});
			return false;
		}

		const isMatch = CryptUtil.areHashesEqual(
			authcode.hash,
			CryptUtil.hash(data.authcode, authcode.salt),
		);
		if (isMatch) {
			await prisma.authcode.delete({
				where: { uid: authcode.uid },
				select: { uid: true },
			});
		}

		return isMatch;
	}

	export async function registerUser(data: {
		email: string;
		name: string;
		password: string;
		browser: { name: string; os: string; platform: string; engine: string };
	}): Promise<{ id: string; token: string }> {
		if (!ValidUtil.isPasswordValid(data.password)) {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.BAD_REQUEST,
				`Invalid password on registration: ${data.password}.`,
			);
		}

		let user;
		try {
			user = await prisma.user.create({
				data: { email: data.email, name: data.name, created: 0, updated: 0 },
				select: { uid: true },
			});
		} catch {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.CONFLICT,
				`User with email ${data.email} already exists on registration.`,
			);
		}

		const salt = CryptUtil.randomBytes(16);
		const hash = CryptUtil.hash(data.password, salt);
		await prisma.password.create({
			data: { uid: user.uid, hash, salt, updated: 0 },
			select: { uid: true },
		});

		await prisma.preference.create({
			data: { uid: user.uid, override: {}, updated: 0 },
			select: { uid: true },
		});

		const session = await loginUser(data);
		return session;
	}

	export async function loginUser(data: {
		email: string;
		password: string;
		browser: { name: string; os: string; platform: string; engine: string };
	}): Promise<{ id: string; token: string }> {
		const user = await prisma.user.findUnique({
			where: { email: data.email },
			select: { uid: true, password: true, sessions: true },
		});
		if (!user) {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`User with email ${data.email} does not exist on login.`,
			);
		}

		const isPasswordValid = CryptUtil.areHashesEqual(
			user.password!.hash,
			CryptUtil.hash(data.password, user.password!.salt),
		);
		if (!isPasswordValid) {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`Invalid password for ${data.email} on login: ${data.password}.`,
			);
		}

		const token = CryptUtil.randomHexCode(configs.auth.bearerTokenLen);
		const key = token + JSON.stringify(data.browser);

		const salt = CryptUtil.randomBytes(16);
		const hash = CryptUtil.hash(key, salt);
		const session = await prisma.session.create({
			data: { uid: user.uid, hash, salt, created: 0 },
			select: { id: true },
		});

		return { id: session.id.toString(), token };
	}

	export async function loginSession(data: {
		sessionToken: { id: string; token: string };
		browser: { name: string; os: string; platform: string; engine: string };
	}): Promise<{ id: string; token: string }> {
		const sid = BigInt(data.sessionToken.id);

		let session;
		try {
			session = await prisma.session.delete({
				where: { id: sid },
			});
		} catch {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.NOT_FOUND,
				`Session with id ${sid} does not exist on session login.`,
			);
		}

		const token = data.sessionToken.token;
		const key = token + JSON.stringify(data.browser);

		const isExpired = TimeUtil.isExpired(session.created, {
			day: configs.auth.sessionExpiryDay,
		});
		if (isExpired) {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`Session with id ${sid} has expired on session login.`,
			);
		}

		const isValidToken = CryptUtil.areHashesEqual(
			session.hash,
			CryptUtil.hash(key, session.salt),
		);
		if (!isValidToken) {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`Invalid bearer token for session with id ${sid} on session login.`,
			);
		}

		const newToken = CryptUtil.randomHexCode(configs.auth.bearerTokenLen);
		const newKey = newToken + JSON.stringify(data.browser);
		const newSalt = CryptUtil.randomBytes(16);
		const newHash = CryptUtil.hash(newKey, newSalt);
		const newSession = await prisma.session.create({
			data: { uid: session.uid, hash: newHash, salt: newSalt, created: 0 },
			select: { id: true },
		});

		return { id: newSession.id.toString(), token: newToken };
	}

	export async function deleteUser(uid: string): Promise<void> {
		try {
			await prisma.user.delete({
				where: { uid: BigInt(uid) },
				select: { uid: true },
			});
		} catch {
			throw new ErrorUtil.ErrorResponse(
				StatusCodes.NOT_FOUND,
				`User with uid ${uid} does not exist on user deletion.`,
			);
		}
	}
}
