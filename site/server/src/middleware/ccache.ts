import { RequestHandler } from "express";

export function ccontrol(type: "no-cache"): RequestHandler {
	return (_, res, next) => {
		res.set("Cache-Control", type);
		next();
	};
}
