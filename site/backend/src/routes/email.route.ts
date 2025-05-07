import { Router } from "express";

import { EmailService } from "services/email.service.js";

export const emailRoute = Router();

emailRoute.get("/is-free/:email", async (req, res) => {
	const isfree = await EmailService.isEmailFree(req.params.email);
	res.send(isfree);
});
