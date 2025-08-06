import { zBearer } from "@app/schema";
import { CookieOptions } from "express";
import { configs } from "../configs/configs";
import { addtime } from "../utils/time";

export function bearer(token: zBearer): ["bearer", zBearer, CookieOptions] {
	return ["bearer", token, { httpOnly: true, expires: addtime(configs.sessionAge) }];
}
