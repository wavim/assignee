import { PutCodesRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import { authen } from "../middleware/authen";
import { member } from "../middleware/member";
import { getCode, putCode } from "../services/codes.service";

export const codes = Router()
	.get("/:tid", authen, member, async (req, res) => {
		try {
			if (!req.own) {
				throw new HttpError("FORBIDDEN", "Not Team Owner");
			}
			res.json(await getCode(req.tid));
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.put("/", authen, async (req, res) => {
		const { success, error, data } = PutCodesRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			res.json(await putCode(req.uid, data));
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
