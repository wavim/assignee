// @ts-types="@types/express"
import { json, Router } from "express";
// @ts-types="@types/cookie-parser"
import cookie from "npm:cookie-parser";

import { auth } from "./auth.route.ts";
import { prisma } from "/db/client.ts";

export const route = Router().use(json()).use(cookie())
  .use(auth);

// MO DEV 
route.post("/reset", async (_, res) => {
  await prisma.session.deleteMany({});
  res.send("cleared");
});
