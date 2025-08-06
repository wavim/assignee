import { zAuthId, zBearer } from "@app/schema";
import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import { HttpError } from "@wavim/http-error";
import { prisma } from "../database/client";
import { chash, match } from "../utils/crypt";

export async function rotate({ sid }: zBearer): Promise<zBearer> {
	try {
		const { uid } = await prisma.sess.delete({ select: { uid: true }, where: { sid } });

		return await session(uid);
	} catch {
		throw new HttpError("UNAUTHORIZED", "Session Doesnt Exist");
	}
}

export async function signin({ eml, pwd }: zAuthId): Promise<zBearer> {
	const user = await prisma.user.findUnique({
		select: { uid: true, Pass: true },
		where: { mail: eml },
	});

	if (!user) {
		throw new HttpError("UNAUTHORIZED", "Invalid Email or Password");
	}

	if (!user.Pass) {
		throw new HttpError("INTERNAL_SERVER_ERROR", "Lost Password Entry");
	}

	if (!match(pwd, user.Pass.hash, user.Pass.salt)) {
		throw new HttpError("UNAUTHORIZED", "Invalid email or password.");
	}

	return await session(user.uid);
}

export async function signup({ eml, pwd }: zAuthId): Promise<zBearer> {
	let user;

	try {
		user = await prisma.user.create({
			select: { uid: true },
			data: { mail: eml, name: eml.split("@", 1)[0] },
		});
	} catch {
		throw new HttpError("CONFLICT", "Email Already in Use");
	}

	try {
		await prisma.pass.create({
			select: { uid: true /* none */ },
			data: { uid: user.uid, ...chash(pwd) },
		});
	} catch {
		throw new HttpError("INTERNAL_SERVER_ERROR", "Existing Password Entry");
	}

	return await session(user.uid);
}

async function session(uid: number): Promise<zBearer> {
	const key = bytesToHex(randomBytes(32));

	const { sid } = await prisma.sess.create({
		select: { sid: true },
		data: { uid, ...chash(key) },
	});

	return { sid, key };
}
