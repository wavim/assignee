import cookie from "cookie-parser";
import { json, Router } from "express";
import { auth } from "./auth.route";
import { code } from "./code.route";
import { task } from "./task.route";
import { team } from "./team.route";

export const route = Router()
	.use(json())
	.use(cookie())

	.use(auth)
	.use(team)
	.use(code)
	.use(task);
