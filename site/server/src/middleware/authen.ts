import { BearerToken, zBearerToken } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";
import { match } from "../utils/crypt";
import { expired } from "../utils/time";

export const authen: RequestHandler = async (req, res, next) => {
	const cookies = req.cookies as { token: zBearerToken };
	const { success, data } = BearerToken.safeParse(cookies.token);

	try {
		if (!success) {
			throw new HttpError("UNAUTHORIZED", "No Session Cookie");
		}
		const { sid, key } = data;

		const session = await prisma.sess.findUnique({
			select: { uid: true, hash: true, salt: true, created: true },
			where: { sid },
		});

		if (!session) {
			throw new HttpError("UNAUTHORIZED", "Session Doesnt Exist");
		}
		const { uid, hash, salt, created } = session;

		if (expired(created, CONFIG.SESS_ROT)) {
			if (expired(created, CONFIG.SESS_AGE)) {
				throw new HttpError("UNAUTHORIZED", "Session Has Expired");
			}
			req.rot = true;
		}

		if (!match(key, hash, salt)) {
			throw new HttpError("UNAUTHORIZED", "Invalid Session Key");
		}

		req.uid = uid;
		next();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
};
