import cookie from "cookie-parser";
import { json, Router } from "express";
import { task } from "./task.route";
import { team } from "./team.route";
import { users } from "./users.route";

export const router = Router()
	.use(json())
	.use(cookie())

	.use("/users", users);
// .use("/team", team)
// .use("/task", task);
