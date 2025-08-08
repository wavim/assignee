import { zBearerToken, zCredentials } from "@app/schema";
import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import { HttpError } from "@wavim/http-error";
import { prisma } from "../database/client";
import { none } from "../database/none";
import { chash, match } from "../utils/crypt";

export async function signin({ mail, pass }: zCredentials): Promise<zBearerToken> {
	const user = await prisma.user.findUnique({ select: { uid: true, Pass: true }, where: { mail } });

	if (!user) {
		throw new HttpError("UNAUTHORIZED", "Invalid Email or Password");
	}

	if (!user.Pass) {
		throw new HttpError("INTERNAL_SERVER_ERROR", "Lost Password Entry");
	}

	if (!match(pass, user.Pass.hash, user.Pass.salt)) {
		throw new HttpError("UNAUTHORIZED", "Invalid Email or Password.");
	}

	return await session(user.uid);
}

export async function signup({ mail, pass }: zCredentials): Promise<zBearerToken> {
	const name = mail.split("@", 1)[0];
	let user;

	try {
		user = await prisma.user.create({
			select: { uid: true },
			data: {
				mail,
				name,

				Pass: { create: chash(pass) },
			},
		});
	} catch {
		throw new HttpError("CONFLICT", "Email Not Available");
	}

	return await session(user.uid);
}

export async function rotate({ sid }: zBearerToken, uid: number): Promise<zBearerToken> {
	await prisma.sess.delete({ select: { sid: none }, where: { sid } });

	return await session(uid);
}

export async function logout({ sid }: zBearerToken): Promise<void> {
	await prisma.sess.delete({ select: { sid: none }, where: { sid } });
}

async function session(uid: number): Promise<zBearerToken> {
	const key = bytesToHex(randomBytes(32));

	return {
		...(await prisma.sess.create({ select: { sid: true }, data: { uid, ...chash(key) } })),
		key,
	};
}
