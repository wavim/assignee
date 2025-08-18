import { PostTeamRequest } from "@app/schema";
import { ErrorCode } from "@wavim/http-error";
import { Router } from "express";
import { authen } from "../middleware/authen";
import { ccontrol } from "../middleware/ccache";
import { member } from "../middleware/member";
import { createTeam, queryTeams, teamDetail } from "../services/team.service";

export const team = Router()
	.use(ccontrol("no-cache"))

	.post("/teams", authen, async (req, res) => {
		const { success, error, data } = PostTeamRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}

		try {
			res.json(await createTeam(req.uid, data));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.get("/teams", authen, async (req, res) => {
		try {
			res.json(await queryTeams(req.uid));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.get("/teams/:tid", authen, member, async (req, res) => {
		try {
			res.json(await teamDetail(req.tid, req.own));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
