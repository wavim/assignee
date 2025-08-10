import { TeamDetails } from "@app/schema";
import { ErrorCode } from "@wavim/http-error";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prettifyError } from "zod/mini";
import { CONFIG } from "../configs/configs";
import { authen } from "../middleware/authen";
import { create } from "../services/team.service";

export const team = Router();

const limCreate = rateLimit(CONFIG.RATE_LIM.TEAM_CREATE);

team.post("/create", limCreate, authen, async (req, res) => {
	const { success, error, data } = TeamDetails.safeParse(req.body);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		res.json(await create(req.uid, data));
	} catch {
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});
