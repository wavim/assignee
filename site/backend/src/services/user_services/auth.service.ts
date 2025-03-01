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
			subject: `${code} - Assignee Authcode`,
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
			prisma.authcode.delete({
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

	export async function registerUser(data: {
		email: string;
		name: string;
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

		const session = await loginUser(data);
		return session;
	}

	export async function loginUser(data: {
		email: string;
		password: string;
		browser: {
			name: string;
			os: string;
			platform: string;
			engine: string;
		};
		token?: string;
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

		const token = data.token ?? CryptUtils.randomToken(configs.auth.bearerTokenLen);
		const key = token + JSON.stringify(data.browser);

		if (data.token) {
			for (const session of user.sessions) {
				const isExpired = TimeUtils.isExpired(session.created, {
					d: configs.auth.sessionExpiryDay,
				});
				if (isExpired) {
					prisma.session.delete({
						where: {
							id: session.id,
						},
					});
					continue;
				}

				const isActiveSession = CryptUtils.areHashesEqual(
					session.hash,
					CryptUtils.hash(key, session.salt),
				);
				if (!isActiveSession) continue;

				const newToken = CryptUtils.randomToken(configs.auth.bearerTokenLen);
				const newKey = token + JSON.stringify(data.browser);
				const newSalt = CryptUtils.randomBytes(16);
				const newHash = CryptUtils.hash(newKey, newSalt);
				await prisma.session.update({
					where: {
						id: session.id,
					},
					data: {
						hash: newHash,
						salt: newSalt,
					},
				});

				return {
					uid: user.uid,
					token: newToken,
				};
			}
		}

		const isPasswordValid = CryptUtils.areHashesEqual(
			user.password!.hash,
			CryptUtils.hash(data.password, user.password!.salt),
		);
		if (!isPasswordValid) throw new Error(`Invalid password on login: ${data.password}.`);

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

	export async function deleteUser(uid: bigint): Promise<void> {
		await prisma.user.delete({
			where: { uid },
		});
	}
}
