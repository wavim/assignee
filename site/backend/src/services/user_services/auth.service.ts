import { configs } from "configs.js";

import sgMail from "@sendgrid/mail";
import { prisma } from "prisma/client.prisma.js";

import { CryptUtils } from "../../utils/crypt.util.js";
import { TimeUtils } from "../../utils/time.util.js";
import { ValidUtils } from "../../utils/valid.util.js";

import { AuthcodeEmail } from "../../assets/authcode.template.js";

export namespace AuthServices {
	export async function sendAuthcode(data: { uid: bigint; email: string; name: string }): Promise<void> {
		if (!ValidUtils.isEmailValid(data.email)) throw new Error(`Invalid email on signup: ${data.email}.`);

		try {
			await prisma.authcode.delete({
				where: {
					uid: data.uid,
				},
			});
		} catch {}

		const code = CryptUtils.randomCode(6);
		const salt = CryptUtils.randomBytes(16);
		const hash = CryptUtils.hash(code, salt);
		await prisma.authcode.create({
			data: {
				uid: data.uid,
				hash,
				salt,
				created: 0,
			},
		});

		sgMail.setApiKey(configs.auth.sgApiKey);
		await sgMail.send({
			from: configs.auth.sgSender,
			to: data.email,
			subject: "Assignee Authcode",
			html: AuthcodeEmail({
				name: data.name,
				code,
				expiry: configs.auth.authcodeExpiryMin,
			}),
		});
	}

	export async function isAuthcodeValid(data: { uid: bigint; authcode: string }): Promise<boolean> {
		const authcode = await prisma.authcode.findUnique({
			where: {
				uid: data.uid,
			},
		});
		if (!authcode) return false;

		const isExpired = TimeUtils.isExpired(authcode.created, {
			m: configs.auth.authcodeExpiryMin,
		});
		if (isExpired) {
			await prisma.authcode.delete({
				where: { uid: authcode.uid },
			});
			return false;
		}

		const isMatch = CryptUtils.areHashesEqual(authcode.hash, CryptUtils.hash(data.authcode, authcode.salt));
		if (isMatch) {
			await prisma.authcode.delete({
				where: { uid: authcode.uid },
			});
		}
		return isMatch;
	}

	export async function isEmailAvailable(email: string): Promise<boolean> {
		const found = await prisma.user.findUnique({
			where: { email },
		});
		return !found;
	}

	export async function signup(data: { email: string; name: string; password: string }): Promise<void> {
		const user = await prisma.user.create({
			data: { email: data.email, name: data.name, created: 0, updated: 0 },
		});

		const salt = CryptUtils.randomBytes(16);
		const hash = CryptUtils.hash(data.password, salt);
		await prisma.password.create({
			data: {
				uid: user.uid,
				hash,
				salt,
				updated: 0,
			},
		});

		await prisma.preference.create({
			data: {
				uid: user.uid,
				override: {},
				updated: 0,
			},
		});
	}

	export async function login(data: {
		email: string;
		password: string;
		browser: {
			name: string;
			os: string;
			platform: string;
			engine: string;
		};
	}): Promise<{
		uid: bigint;
		token: string;
	}> {
		const user = await prisma.user.findUniqueOrThrow({
			where: { email: data.email },
			include: {
				password: true,
				sessions: true,
			},
		});

		//MO TODO active sessions check & skip

		const isPasswordValid = CryptUtils.areHashesEqual(
			user.password!.hash,
			CryptUtils.hash(data.password, user.password!.salt),
		);
		if (!isPasswordValid) throw new Error(`Invalid password on login: ${data.password}.`);

		const token = CryptUtils.randomToken(configs.auth.bearerTokenLen);

		const key = token + JSON.stringify(data.browser);
		const salt = CryptUtils.randomBytes(16);
		const hash = CryptUtils.hash(key, salt);
		await prisma.session.create({
			data: {
				uid: user.uid,
				hash,
				salt,
				created: 0,
			},
		});

		return {
			uid: user.uid,
			token,
		};
	}
}
