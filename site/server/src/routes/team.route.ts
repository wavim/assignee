import { InviteCode, TeamProfile } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prettifyError } from "zod/mini";
import { CONFIG } from "../configs/configs";
import { authen } from "../middleware/authen";
import { member } from "../middleware/member";
import { accept, create, details, invite } from "../services/team.service";

export const team = Router();

const limCreate = rateLimit(CONFIG.RATE_LIM.TEAM_CREATE);
const limInvite = rateLimit(CONFIG.RATE_LIM.TEAM_INVITE);
const limAccept = rateLimit(CONFIG.RATE_LIM.TEAM_ACCEPT);

team.post("/create", authen, limCreate, async (req, res) => {
	const { success, error, data } = TeamProfile.safeParse(req.body);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		res.json(await create(req.uid, data));
	} catch {
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

team.post("/invite", authen, member, limInvite, async (req, res) => {
	if (!req.own) {
		return res.status(ErrorCode.UNAUTHORIZED).send("No Team Authorship");
	}

	try {
		res.json(await invite(req.tid));
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

team.post("/accept", authen, limAccept, async (req, res) => {
	const { success, error, data } = InviteCode.safeParse(req.body);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		res.json(await accept(req.uid, data));
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

team.get("/details", authen, member, async (req, res) => {
	try {
		res.json(await details(req.tid, req.own));
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});
