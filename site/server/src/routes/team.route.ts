import { InviteCode, TeamID, TeamProfile } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prettifyError } from "zod/mini";
import { CONFIG } from "../configs/configs";
import { authen } from "../middleware/authen";
import { accept, create, invite } from "../services/team.service";

export const team = Router();

const limCreate = rateLimit(CONFIG.RATE_LIM.TEAM_CREATE);
const limInvite = rateLimit(CONFIG.RATE_LIM.TEAM_INVITE);
const limAccept = rateLimit(CONFIG.RATE_LIM.TEAM_ACCEPT);

team.post("/create", limCreate, authen, async (req, res) => {
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

// MO TODO add guard middleware
team.post("/invite", limInvite, authen, async (req, res) => {
	const { success, error, data } = TeamID.safeParse(req.body);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		res.json(await invite(req.uid, data));
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

team.post("/accept", limAccept, authen, async (req, res) => {
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
