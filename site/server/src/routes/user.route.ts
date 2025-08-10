import { ErrorCode } from "@wavim/http-error";
import { Router } from "express";
import { authen } from "../middleware/authen";
import { members } from "../services/user.service";

export const user = Router();

user.get("/members", authen, async (req, res) => {
	try {
		res.json(await members(req.uid));
	} catch {
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});
