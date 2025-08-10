import cookie from "cookie-parser";
import { json, Router } from "express";
import { auth } from "./auth.route";
import { team } from "./team.route";
import { user } from "./user.route";

export const router = Router();
router.use(json()).use(cookie());

router.use("/auth", auth);
router.use("/user", user);
router.use("/team", team);
