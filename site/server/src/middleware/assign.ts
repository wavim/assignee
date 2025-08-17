import { GetTaskRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { RequestHandler } from "express";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";

export const assign: RequestHandler = async (req, res, next) => {
	const { success, data } = GetTaskRequest.safeParse(req.params);

	try {
		if (!success) {
			throw new HttpError("FORBIDDEN", "Missing Task ID");
		}
		const aid = configs.hashAID.decode(data.aid);

		if (isNaN(aid)) {
			throw new HttpError("FORBIDDEN", "Invalid Task ID");
		}

		const task = await prisma.task.findUnique({ select: { tid: true }, where: { aid } });

		if (!task) {
			throw new HttpError("FORBIDDEN", "Invalid Task ID");
		}
		const { tid } = task;

		const membership = await prisma.member.findUnique({
			select: { auth: true },
			where: { pk: { uid: req.uid, tid } },
		});

		if (!membership) {
			throw new HttpError("FORBIDDEN", "Not Team Member");
		}

		req.tid = tid;
		req.aid = aid;
		req.own = membership.auth;
		next();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
};
