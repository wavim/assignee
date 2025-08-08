import { BearerToken, Credentials, zBearerToken } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { prettifyError } from "zod/mini";
import { CONFIG } from "../configs/configs";
import { authen } from "../middleware/authen";
import { logout, rotate, signin, signup } from "../services/auth.service";
import { addtime } from "../utils/time";

export const auth = Router();

const limSigner = rateLimit(CONFIG.RATE_LIM.AUTH_SIGNER);
const limVerify = rateLimit(CONFIG.RATE_LIM.AUTH_VERIFY);

const bearer = (token: zBearerToken) => {
	return ["bearer", token, { httpOnly: true, expires: addtime(CONFIG.SESS_AGE) }] as const;
};

auth.post("/signin", limSigner, async (req, res) => {
	const { success, error, data } = Credentials.safeParse(req.body);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		res.cookie(...bearer(await signin(data))).end();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

auth.post("/signup", limSigner, async (req, res) => {
	const { success, error, data } = Credentials.safeParse(req.body);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		res.cookie(...bearer(await signup(data))).end();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

auth.post("/rotate", limVerify, authen, async (req, res) => {
	const cookies = req.cookies as { bearer: zBearerToken };
	const { success, error, data } = BearerToken.safeParse(cookies.bearer);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		res.cookie(...bearer(await rotate(data, req.uid))).end();
	} catch {
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

auth.post("/logout", limVerify, authen, async (req, res) => {
	const cookies = req.cookies as { bearer: zBearerToken };
	const { success, error, data } = BearerToken.safeParse(cookies.bearer);

	if (!success) {
		return res.status(ErrorCode.BAD_REQUEST).send(prettifyError(error));
	}

	try {
		await logout(data);
		res.end();
	} catch {
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});
