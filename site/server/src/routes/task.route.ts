import { PostTeamTaskRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import { authen } from "../middleware/authen";
import { member } from "../middleware/member";
import { createTask, queryTasks, queryTeamTasks } from "../services/task.service";

export const task = Router()
	.get("/tasks", authen, async (req, res) => {
		try {
			res.json(await queryTasks(req.uid));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.post("/teams/:tid/tasks", authen, member, async (req, res) => {
		const { success, error, data } = PostTeamTaskRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			if (!req.own) {
				throw new HttpError("FORBIDDEN", "Not Team Owner");
			}
			res.json(await createTask(req.tid, data));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.get("/teams/:tid/tasks", authen, member, async (req, res) => {
		try {
			res.json(await queryTeamTasks(req.uid, req.tid, req.own));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
