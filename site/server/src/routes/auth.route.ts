import { BearerToken, Credentials, zBearerToken } from "@app/schema";
import { ErrorCode, HttpError } from "@wavim/http-error";
import { CookieOptions, Router } from "express";
import { rateLimit } from "express-rate-limit";
import { flattenError } from "zod";
import { configs } from "../configs/configs";
import { authen } from "../middleware/authen";
import { rotate, signin, signup } from "../services/auth.service";
import { addtime } from "../utils/time";

export const auth = Router();

const limRotate = rateLimit({ skipSuccessfulRequests: true });
const limSigner = rateLimit();

function bearer(token: zBearerToken): ["bearer", zBearerToken, CookieOptions] {
	return ["bearer", token, { httpOnly: true, expires: addtime(configs.sessAge) }];
}

auth.post("/rotate", limRotate, authen, async (req, res) => {
	const cookies = req.cookies as { bearer: zBearerToken };
	const { success, error, data } = BearerToken.safeParse(cookies.bearer);

	if (!success) {
		return res.status(400).json(flattenError(error));
	}

	try {
		res.cookie(...bearer(await rotate(data))).end();
	} catch (e) {
		if (e instanceof HttpError) {
			return res.status(e.status).send(e.message);
		}
		res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
	}
});

auth.post("/signin", limSigner, async (req, res) => {
	const { success, error, data } = Credentials.safeParse(req.body);

	if (!success) {
		return res.status(400).json(flattenError(error));
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
		return res.status(400).json(flattenError(error));
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
