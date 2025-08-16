import { PostTeamsRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import { authen } from "../middleware/authen";
import { member } from "../middleware/member";
import { createTeam, queryTeams, teamDetail } from "../services/teams.service";

export const teams = Router()
	.post("/", authen, async (req, res) => {
		const { success, error, data } = PostTeamsRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			res.json(await createTeam(req.uid, data));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.get("/", authen, async (req, res) => {
		try {
			res.json(await queryTeams(req.uid));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.get("/:tid", authen, member, async (req, res) => {
		try {
			res.json(await teamDetail(req.tid, req.own));
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
