import { Router } from "express";

import { AuthServices } from "services/user_services/auth.service.js";

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
		res.status(200).json(newSessionToken);
	} catch (err) {
		next(err);
	}
});

// userRoutes.post("/register", (req, res) => {
// 	const payload: {
// 		email: string;
// 		name: string;
// 		password: string;
// 	} = req.body;
// });
