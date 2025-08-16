import { UserSessionCookie } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";
import { match } from "../utils/crypt";
import { expired } from "../utils/time";

export const authen: RequestHandler = async (req, res, next) => {
	const cookies = req.cookies as { tok: UserSessionCookie };
	const { success, data } = UserSessionCookie.safeParse(cookies.tok);

	try {
		if (!success) {
			throw new HttpError("UNAUTHORIZED", "Missing Session Cookie");
		}
		const sid = configs.hashSID.decode(data.sid);

		const session = await prisma.sess.findUnique({
			select: { uid: true, hash: true, salt: true, updated: true },
			where: { sid },
		});

		if (!session) {
			throw new HttpError("UNAUTHORIZED", "Session Doesnt Exist");
		}
		const { uid, hash, salt, updated } = session;

		if (expired(updated, configs.sessRot)) {
			if (expired(updated, configs.sessAge)) {
				throw new HttpError("UNAUTHORIZED", "Session Has Expired");
			}
			req.rot = true;
		}

		if (!match(data.key, hash, salt)) {
			throw new HttpError("UNAUTHORIZED", "Invalid Session Key");
		}

		req.uid = uid;
		req.sid = sid;
		next();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
};
