import { GetTeamsTeamIdRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";

export const member: RequestHandler = async (req, res, next) => {
	const { success, data } = GetTeamsTeamIdRequest.safeParse(req.params);

	try {
		if (!success) {
			throw new HttpError("FORBIDDEN", "Missing Team ID");
		}
		const tid = configs.hashTID.decode(data.tid);

		if (isNaN(tid)) {
			throw new HttpError("FORBIDDEN", "Invalid Team ID");
		}

		const membership = await prisma.member.findUnique({
			select: { auth: true },
			where: { pk: { uid: req.uid, tid } },
		});

		if (!membership) {
			throw new HttpError("FORBIDDEN", "Not Team Member");
		}

		req.tid = tid;
		req.own = membership.auth;
		next();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
};
