// @ts-types="@types/express"
import { CookieOptions } from "express";

import { zBearer } from "@schema";
import { configs } from "/configs/configs.ts";
import { addtime } from "/utils/time.ts";

export function bearer(token: zBearer): ["bearer", zBearer, CookieOptions] {
  return ["bearer", token, {
    httpOnly: true,
    expires: addtime(configs.sessionAge),
  }];
}
