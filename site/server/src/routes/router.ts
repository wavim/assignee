import cookie from "cookie-parser";
import { json, Router } from "express";
import { auth } from "./auth.route";
import { team } from "./team.route";

export const router = Router();
router.use(json()).use(cookie());

router.use("/auth", auth);
router.use("/team", team);
