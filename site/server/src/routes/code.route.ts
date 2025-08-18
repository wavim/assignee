import { PutMembRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import { authen } from "../middleware/authen";
import { ccontrol } from "../middleware/ccache";
import { member } from "../middleware/member";
import { getCode, putMemb } from "../services/code.service";

export const code = Router()
	.use(ccontrol("no-cache"))

	.get("/teams/:tid/code", authen, member, async (req, res) => {
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
	.put("/membs", authen, async (req, res) => {
		const { success, error, data } = PutMembRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		
		try {
			res.json(await putMemb(req.uid, data));
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
