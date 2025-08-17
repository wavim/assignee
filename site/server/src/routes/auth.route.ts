import { SessionCookie, SigninRequest, SignupRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { configs } from "../configs/configs";
import { authen } from "../middleware/authen";
import { ccontrol } from "../middleware/ccache";
import { logout, rotate, signin, signup } from "../services/auth.service";
import { addtime } from "../utils/time";

const tok = (tok: SessionCookie) => {
	return [
		"tok",
		tok,
		// MO NOTE serving over HTTP for DEMO ONLY
		{ httpOnly: true, secure: false, expires: addtime(configs.sessAge) },
	] as const;
};

export const auth = Router()
	.use(ccontrol("no-cache"))

	.post("/auth/verify", authen, async (req, res) => {
		if (!req.rot) {
			return res.send(0);
		}
		try {
			res.cookie(...tok(await rotate(req.sid))).send(0);
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.post("/auth/logout", authen, async (req, res) => {
		try {
			await logout(req.sid);
			res.clearCookie("tok", { httpOnly: true, secure: true }).send(0);
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})

	.post("/auth/signin", rateLimit(configs.rateLim["auth/signin"]), async (req, res) => {
		const { success, error, data } = SigninRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			res.cookie(...tok(await signin(data))).send(0);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.post("/auth/signup", rateLimit(configs.rateLim["auth/signup"]), async (req, res) => {
		const { success, error, data } = SignupRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			res.cookie(...tok(await signup(data))).send(0);
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
