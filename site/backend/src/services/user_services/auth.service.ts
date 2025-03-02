import { configs } from "configs.js";

import sgMail from "@sendgrid/mail";
import { prisma } from "prisma/client.prisma.js";

import { StatusCodes } from "http-status-codes";

import { ErrorUtils } from "utils/error.util.js";
import { CryptUtils } from "../../utils/crypt.util.js";
import { TimeUtils } from "../../utils/time.util.js";
import { ValidUtils } from "../../utils/valid.util.js";

import { AuthcodeEmail } from "../../assets/authcode.template.js";

export namespace AuthServices {
	export async function sendAuthcode(data: {
		uid: string;
		email: string;
		name: string;
	}): Promise<void> {
		const uid = BigInt(data.uid);

		try {
			await prisma.authcode.delete({ where: { uid }, select: { uid: true } });
		} catch {}

		const code = CryptUtils.randomDecCode(6);
		const salt = CryptUtils.randomBytes(16);
		const hash = CryptUtils.hash(code, salt);
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
			throw new ErrorUtils.ErrorResponse(
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

		const isExpired = TimeUtils.isExpired(authcode.created, {
			min: configs.auth.authcodeExpiryMin,
		});
		if (isExpired) {
			await prisma.authcode.delete({
				where: { uid: authcode.uid },
				select: { uid: true },
			});
			return false;
		}

		const isMatch = CryptUtils.areHashesEqual(
			authcode.hash,
			CryptUtils.hash(data.authcode, authcode.salt),
		);
		if (isMatch) {
			await prisma.authcode.delete({
				where: { uid: authcode.uid },
				select: { uid: true },
			});
		}

		return isMatch;
	}

	export async function isEmailAvailable(email: string): Promise<boolean> {
		const found = await prisma.user.findUnique({
			where: { email },
			select: { uid: true },
		});
		return !found;
	}

	export async function registerUser(data: {
		email: string;
		name: string;
		password: string;
		browser: { name: string; os: string; platform: string; engine: string };
	}): Promise<{ id: string; token: string }> {
		if (!ValidUtils.isEmailValid(data.email)) {
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.BAD_REQUEST,
				`Invalid email on registration: ${data.email}.`,
			);
		}
		if (!ValidUtils.isPasswordValid(data.password)) {
			throw new ErrorUtils.ErrorResponse(
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
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.CONFLICT,
				`User with email ${data.email} already exists on registration.`,
			);
		}

		const salt = CryptUtils.randomBytes(16);
		const hash = CryptUtils.hash(data.password, salt);
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
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`User with email ${data.email} does not exist on login.`,
			);
		}

		const isPasswordValid = CryptUtils.areHashesEqual(
			user.password!.hash,
			CryptUtils.hash(data.password, user.password!.salt),
		);
		if (!isPasswordValid) {
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`Invalid password for ${data.email} on login: ${data.password}.`,
			);
		}

		const token = CryptUtils.randomHexCode(configs.auth.bearerTokenLen);
		const key = token + JSON.stringify(data.browser);

		const salt = CryptUtils.randomBytes(16);
		const hash = CryptUtils.hash(key, salt);
		const session = await prisma.session.create({
			data: { uid: user.uid, hash, salt, created: 0 },
			select: { id: true },
		});

		return { id: session.id.toString(), token };
	}

	//MO NOTE room for improvement, database {session} shall have key {uid+sid} and can be updated
	//MO TODO mention this ^ in the report, but really this is minor, bigint is, well, BIG
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
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.NOT_FOUND,
				`Session with id ${sid} does not exist on session login.`,
			);
		}

		const token = data.sessionToken.token;
		const key = token + JSON.stringify(data.browser);

		const isExpired = TimeUtils.isExpired(session.created, {
			day: configs.auth.sessionExpiryDay,
		});
		if (isExpired) {
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`Session with id ${sid} has expired on session login.`,
			);
		}

		const isValidToken = CryptUtils.areHashesEqual(
			session.hash,
			CryptUtils.hash(key, session.salt),
		);
		if (!isValidToken) {
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.UNAUTHORIZED,
				`Invalid bearer token for session with id ${sid} on session login.`,
			);
		}

		const newToken = CryptUtils.randomHexCode(configs.auth.bearerTokenLen);
		const newKey = newToken + JSON.stringify(data.browser);
		const newSalt = CryptUtils.randomBytes(16);
		const newHash = CryptUtils.hash(newKey, newSalt);
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
			throw new ErrorUtils.ErrorResponse(
				StatusCodes.NOT_FOUND,
				`User with uid ${uid} does not exist on user deletion.`,
			);
		}
	}
}
