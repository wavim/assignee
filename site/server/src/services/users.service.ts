import { PostUsersSigninRequest, PostUsersSignupRequest, UserSessionCookie } from "@app/schema";
import { HttpError } from "@wavim/http-error";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";
import { none } from "../database/none";
import { chash, match, randk } from "../utils/crypt";

export async function rotate(sid: number): Promise<UserSessionCookie> {
	const key = randk();
	await prisma.sess.update({ data: chash(key), where: { sid } });

	return { sid: configs.hashSID.encode(sid), key };
}

async function createSession(uid: number): Promise<UserSessionCookie> {
	const key = randk();
	const { sid } = await prisma.sess.create({ select: { sid: true }, data: { uid, ...chash(key) } });

	return { sid: configs.hashSID.encode(sid), key };
}

export async function signin(req: PostUsersSigninRequest): Promise<UserSessionCookie> {
	const user = await prisma.user.findUnique({
		select: { uid: true, Pass: { select: { hash: true, salt: true } } },
		where: { mail: req.mail },
	});

	if (!user) {
		throw new HttpError("UNAUTHORIZED", "Invalid Email or Password");
	}

	if (!user.Pass) {
		throw new HttpError("INTERNAL_SERVER_ERROR", "No Password Data");
	}

	if (!match(req.pass, user.Pass.hash, user.Pass.salt)) {
		throw new HttpError("UNAUTHORIZED", "Invalid Email or Password");
	}

	return await createSession(user.uid);
}

export async function signup(req: PostUsersSignupRequest): Promise<UserSessionCookie> {
	try {
		const { uid } = await prisma.user.create({
			select: { uid: true },
			data: { mail: req.mail, name: req.mail.split("@", 1)[0], Pass: { create: chash(req.pass) } },
		});

		return await createSession(uid);
	} catch {
		throw new HttpError("CONFLICT", "Email Not Available");
	}
}

export async function logout(sid: number): Promise<void> {
	await prisma.sess.delete({ select: { sid: none }, where: { sid } });
}
