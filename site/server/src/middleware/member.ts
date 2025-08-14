import { TeamID } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";
import { decode } from "../utils/hashid";

export const member: RequestHandler = async (req, res, next) => {
	const { success, data } = TeamID.safeParse(req.method === "GET" ? req.query : req.body);

	try {
		if (!success) {
			throw new HttpError("FORBIDDEN", "Missing Team Hash");
		}
		const tid = decode(CONFIG.HASH_TID, data.hash);

		if (isNaN(tid)) {
			throw new HttpError("FORBIDDEN", "Invalid Team Hash");
		}

		const member = await prisma.member.findUnique({
			select: { auth: true },
			where: { cpk: { uid: req.uid, tid } },
		});

		if (!member) {
			throw new HttpError("FORBIDDEN", "No Team Membership");
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
