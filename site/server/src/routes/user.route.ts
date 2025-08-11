import { ErrorCode } from "@wavim/http-error";
import { Router } from "express";
import { authen } from "../middleware/authen";
import { membership } from "../services/user.service";

export const user = Router();

user.get("/membership", authen, async (req, res) => {
	try {
		res.json(await membership(req.uid));
	} catch {
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});
