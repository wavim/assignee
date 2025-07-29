// @ts-types="@types/express"
import { json, Router } from "express";

import { auth } from "./auth.route.ts";

export const route = Router().use(json())
  .use(auth);
