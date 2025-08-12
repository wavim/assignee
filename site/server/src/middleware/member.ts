import { TeamID } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { prettifyError } from "zod/mini";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";
import { decode } from "../utils/hashid";

export const member: RequestHandler = async (req, res, next) => {
	const { success, error, data } = TeamID.safeParse(req.body);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}
	const tid = decode(CONFIG.HASH_TID, data.hash);

	try {
		const member = await prisma.member.findUnique({
			select: { auth: true },
			where: { cpk: { uid: req.uid, tid } },
		});

		if (!member) {
			throw new HttpError("UNAUTHORIZED", "No Team Membership");
		}

		req.tid = tid;
		req.own = member.auth;
		next();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
};
