import cookie from "cookie-parser";
import { json, Router } from "express";
import { task } from "./task.route";
import { teams } from "./teams.route";
import { users } from "./users.route";

export const router = Router()
	.use(json())
	.use(cookie())

	.use("/users", users)
	.use("/teams", teams);
// .use("/task", task);
