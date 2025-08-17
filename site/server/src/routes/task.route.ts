import {
	GetUserTaskWorkRequest,
	PostTeamTaskRequest,
	PutUserTaskCommRequest,
	PutWorkRequest,
} from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import multer from "multer";
import { assign } from "../middleware/assign";
import { authen } from "../middleware/authen";
import { ccontrol } from "../middleware/ccache";
import { member } from "../middleware/member";
import {
	createTask,
	getTaskFile,
	getUserWorkFile,
	getWorkFile,
	queryTasks,
	queryTeamTasks,
	setTaskFile,
	setWorkComm,
	setWorkDone,
	setWorkFile,
	taskDetail,
} from "../services/task.service";

const filesMulter = multer({ storage: multer.memoryStorage() });

export const task = Router()
	.use(ccontrol("no-cache"))

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
	})

	.get("/tasks/:aid", authen, assign, async (req, res) => {
		try {
			res.json(await taskDetail(req.uid, req.tid, req.aid, req.own));
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.put("/works/:aid", authen, assign, async (req, res) => {
		const { success, error, data } = PutWorkRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			if (req.own) {
				throw new HttpError("FORBIDDEN", "Not A Assignee");
			}

			await setWorkDone(req.uid, req.aid, data);
			res.send(0);
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})

	.post("/tasks/:aid/file", authen, assign, filesMulter.single("file"), async (req, res) => {
		try {
			if (!req.own) {
				throw new HttpError("FORBIDDEN", "Not Team Owner");
			}
			if (!req.file) {
				throw new HttpError("BAD_REQUEST", "File Missing");
			}
			const { originalname, mimetype, buffer } = req.file;

			await setTaskFile(req.aid, originalname, mimetype, buffer);
			res.send(0);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.get("/tasks/:aid/file", authen, assign, async (req, res) => {
		try {
			const file = await getTaskFile(req.aid);
			res
				.setHeader("Content-Type", file.mime)
				.setHeader("Content-Disposition", `attachment; filename="${file.name}"`)
				.send(file.blob);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})

	.post("/works/:aid/file", authen, assign, filesMulter.single("file"), async (req, res) => {
		try {
			if (req.own) {
				throw new HttpError("FORBIDDEN", "Not A Assignee");
			}
			if (!req.file) {
				throw new HttpError("BAD_REQUEST", "File Missing");
			}
			const { originalname, mimetype, buffer } = req.file;

			// MO NOTE done status not checked
			await setWorkFile(req.uid, req.aid, originalname, mimetype, buffer);
			res.send(0);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.get("/works/:aid/file", authen, assign, async (req, res) => {
		try {
			if (req.own) {
				throw new HttpError("FORBIDDEN", "Not A Assignee");
			}

			const file = await getWorkFile(req.uid, req.aid);
			res
				.setHeader("Content-Type", file.mime)
				.setHeader("Content-Disposition", `attachment; filename="${file.name}"`)
				.send(file.blob);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})

	.put("/works/:aid/comm", authen, assign, async (req, res) => {
		const { success, error, data } = PutUserTaskCommRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			if (!req.own) {
				throw new HttpError("FORBIDDEN", "Not Team Owner");
			}

			await setWorkComm(req.aid, data);
			res.send(0);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})

	.get("/works/:aid/:mail/file", authen, assign, async (req, res) => {
		const { success, error, data } = GetUserTaskWorkRequest.safeParse(req.params);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			if (!req.own) {
				throw new HttpError("FORBIDDEN", "Not Team Owner");
			}

			const file = await getUserWorkFile(req.aid, data);
			res
				.setHeader("Content-Type", file.mime)
				.setHeader("Content-Disposition", `attachment; filename="${file.name}"`)
				.send(file.blob);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
