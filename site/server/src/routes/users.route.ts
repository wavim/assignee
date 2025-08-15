import { PostUsersSigninRequest, PostUsersSignupRequest, UserSessionCookie } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { configs } from "../configs/configs";
import { authen } from "../middleware/authen";
import { logout, rotate, signin, signup } from "../services/users.service";
import { addtime } from "../utils/time";

const tok = (tok: UserSessionCookie) => {
	return ["tok", tok, { httpOnly: true, expires: addtime(configs.sessAge) }] as const;
};

export const users = Router()
	.post("/verify", authen, async (req, res) => {
		if (!req.rot) {
			return res.end();
		}
		try {
			res.cookie(...tok(await rotate(req.sid))).end();
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.post("/logout", authen, async (req, res) => {
		try {
			await logout(req.sid);
			res.clearCookie("tok", { httpOnly: true }).end();
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.post("/signin", rateLimit(configs.rateLim["users/signin"]), async (req, res) => {
		const { success, error, data } = PostUsersSigninRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			res.cookie(...tok(await signin(data))).end();
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.post("/signup", rateLimit(configs.rateLim["users/signup"]), async (req, res) => {
		const { success, error, data } = PostUsersSignupRequest.safeParse(req.body);

		if (!success) {
			return res.status(ErrorCode.BAD_REQUEST).send(error);
		}
		try {
			res.cookie(...tok(await signup(data))).end();
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
