import { BearerToken, zBearerToken } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { prettifyError } from "zod/mini";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";
import { match } from "../utils/crypt";
import { expired } from "../utils/time";

export const authen: RequestHandler = async (req, res, next) => {
	const cookies = req.cookies as { bearer: zBearerToken };
	const { success, error, data } = BearerToken.safeParse(cookies.bearer);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}
	const { sid, key } = data;

	try {
		const session = await prisma.sess.findUnique({
			select: { uid: true, hash: true, salt: true, created: true },
			where: { sid },
		});

		if (!session) {
			throw new HttpError("UNAUTHORIZED", "Session Doesnt Exist");
		}
		const { uid, hash, salt, created } = session;

		if (expired(created, configs.sessAge)) {
			throw new HttpError("UNAUTHORIZED", "Session Has Expired");
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
