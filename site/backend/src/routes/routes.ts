import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorRequestHandler, Router, json } from "express";

import { ErrorUtil } from "utils/error.util.js";
import { emailRoute } from "./email.route.js";

export const router = Router();

router.use(cors());
router.use(json());
router.use(cookieParser());

router.use("/email", emailRoute);

const errorHandler: ErrorRequestHandler = (_err, req, res, next) => {
	const err = <ErrorUtil.ErrorResponse>_err;
	res.status(err.code).json({ error: err.message });
};
router.use(errorHandler);
