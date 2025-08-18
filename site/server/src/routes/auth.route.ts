import { SessionCookie, SigninRequest, SignupRequest } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { CookieOptions, Router } from "express";
import rateLimit from "express-rate-limit";
import { configs } from "../configs/configs";
import { authen } from "../middleware/authen";
import { ccontrol } from "../middleware/ccache";
import { logout, rotate, signin, signup } from "../services/auth.service";
import { addtime } from "../utils/time";

const nocont = 204;
const cookie = (cookies: SessionCookie) => {
	return [
		configs.sessKey,
		cookies,
		{ secure: false, expires: addtime(configs.sessAge), httpOnly: true } as CookieOptions,
	] as const;
};

export const auth = Router()
	.use(ccontrol("no-cache"))

	.post("/auth/verify", authen, async (req, res) => {
		if (!req.rot) {
			return res.status(nocont).send();
		}

		try {
			res.cookie(...cookie(await rotate(req.sid)));
			res.status(nocont).send();
		} catch {
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	})
	.post("/auth/logout", authen, async (req, res) => {
		try {
			await logout(req.sid);

			res.clearCookie(configs.sessKey, { secure: false, httpOnly: true });
			res.status(nocont).send();
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
			res.cookie(...cookie(await signin(data)));
			res.status(nocont).send();
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
			res.cookie(...cookie(await signup(data)));
			res.status(nocont).send();
		} catch (e) {
			if (e instanceof HttpError) {
				return res.status(e.status).send(e.message);
			}
			res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	});
