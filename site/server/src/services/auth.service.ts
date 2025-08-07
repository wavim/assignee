import { zBearerToken, zCredentials } from "@app/schema";
import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import { HttpError } from "@wavim/http-error";
import { prisma } from "../database/client";
import { chash, match } from "../utils/crypt";

export async function rotate({ sid }: zBearerToken): Promise<zBearerToken> {
	const { uid } = await prisma.sess.delete({ select: { uid: true }, where: { sid } });

	return await session(uid);
}

export async function signin({ mail, pass }: zCredentials): Promise<zBearerToken> {
	const user = await prisma.user.findUnique({
		select: { uid: true, Pass: true },
		where: { mail },
	});

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
	let user;

	try {
		user = await prisma.user.create({
			select: { uid: true },
			data: { mail, name: mail.split("@", 1)[0] },
		});
	} catch {
		throw new HttpError("CONFLICT", "Email Already in Use");
	}

	await prisma.pass.create({
		select: { uid: true /* none */ },
		data: { uid: user.uid, ...chash(pass) },
	});

	return await session(user.uid);
}

async function session(uid: number): Promise<zBearerToken> {
	const key = bytesToHex(randomBytes(32));

	const { sid } = await prisma.sess.create({
		select: { sid: true },
		data: { uid, ...chash(key) },
	});

	return { sid, key };
}
