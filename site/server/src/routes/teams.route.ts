import { PostTeamsRequest } from "@app/schema";
import { ErrorCode } from "@wavim/http-error";
import { Router } from "express";
import { createTeam, queryTeams } from "../services/teams.service";

export const teams = Router()
	.post("/", async (req, res) => {
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
	.get("/", async (req, res) => {
		try {
			res.json(await queryTeams(req.uid));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});

// team.get("/details", authen, member, async (req, res) => {
// 	try {
// 		res.json(await details(req.tid, req.own));
// 	} catch (e) {
// 		if (e instanceof HttpError) {
// 			return res.status(e.status).send(e.message);
// 		}
// 		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
// 	}
// });
