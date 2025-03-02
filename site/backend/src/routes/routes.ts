import cookieParser from "cookie-parser";
import { ErrorRequestHandler, Router, json } from "express";

import { ErrorUtils } from "utils/error.util.js";
import { userRoutes } from "./user.route.js";

export const routes = Router();
routes.use(json());
routes.use(cookieParser());

routes.use("/user", userRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const _err = <ErrorUtils.ErrorResponse>err;
	res.status(_err.code).json({
		error: _err.message,
	});
};
routes.use(errorHandler);
