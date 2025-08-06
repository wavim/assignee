import cookie from "cookie-parser";
import { json, Router } from "express";
import { prisma } from "../database/client";
import { auth } from "./auth.route";

export const route = Router().use(json()).use(cookie()).use(auth);

// MO DEV db reset endpoint
route.post("/reset", async (_, res) => {
	await prisma.user.deleteMany({});
	await prisma.password.deleteMany({});
	await prisma.session.deleteMany({});

	res.send("DB RESET");
});
