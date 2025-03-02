import { configs } from "configs.js";
import { Router } from "express";

import { AuthServices } from "services/user_services/auth.service.js";
import { TimeUtils } from "utils/time.util.js";

export const userRoutes = Router();

userRoutes.post("/loginsession", async (req, res, next) => {
	const sessionToken: { id: string; token: string } = JSON.parse(
		req.cookies.sessionToken,
	);
	const browser: {
		name: string;
		os: string;
		platform: string;
		engine: string;
	} = req.body.browser;

	try {
		const newSessionToken = await AuthServices.loginSession({
			sessionToken,
			browser,
		});

		res.cookie("sessionToken", JSON.stringify(newSessionToken), {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			expires: TimeUtils.getDateAfter({
				day: configs.auth.sessionExpiryDay,
			}),
		});

		res.status(200).json(newSessionToken);
	} catch (err) {
		next(err);
	}
});
