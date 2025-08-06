import cookie from "cookie-parser";
import { json, Router } from "express";
import { auth } from "./auth.route";

export const router = Router();
router.use(json()).use(cookie());

router.use(auth);
