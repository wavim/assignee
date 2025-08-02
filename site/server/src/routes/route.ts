// @ts-types="@types/express"
import { json, Router } from "express";
// @ts-types="@types/cookie-parser"
import cookie from "npm:cookie-parser";

import { auth } from "./auth.route.ts";

export const route = Router().use(json()).use(cookie())
  .use(auth);
