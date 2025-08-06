import { Bearer, zBearer } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { flattenError } from "zod";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";
import { hashMatch } from "../utils/crypt";
import { expired } from "../utils/time";

export const authenticate: RequestHandler = async (req, res, next) => {
	const cookies = req.cookies as { bearer: zBearer };
	const { success, error, data } = Bearer.safeParse(cookies.bearer);

	if (!success) {
		return res.status(400).json(flattenError(error));
	}

	try {
		const session = await prisma.session.findUnique({
			where: { sid: data.sid },
			select: { hash: true, salt: true, created: true },
		});

		if (!session) {
			throw new HttpError("UNAUTHORIZED", "Session not found.");
		}

		if (expired(session, configs.sessionAge)) {
			throw new HttpError("UNAUTHORIZED", "Session expired.");
		}

		if (!hashMatch(data.key, session)) {
			throw new HttpError("UNAUTHORIZED", "Invalid session key.");
		}

		next();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
};
