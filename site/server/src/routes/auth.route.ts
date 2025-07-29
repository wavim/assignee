// @ts-types="@types/express"
import { Router } from "express";

import { AuthId } from "@schema";
import { signin, signup } from "/services/auth.service.ts";

export const auth = Router();

auth.post("/signin", async (req, res) => {
  const authid = AuthId.safeParse(req.body);

  if (!authid.success) {
    return res.sendStatus(400);
  }

  try {
    res.json(await signin(authid.data));
  } catch (e) {
    if (typeof e === "number") {
      res.sendStatus(e);
    }
  }
});

auth.post("/signup", async (req, res) => {
  const authid = AuthId.safeParse(req.body);

  if (!authid.success) {
    return res.sendStatus(400);
  }

  try {
    res.json(await signup(authid.data));
  } catch (e) {
    if (typeof e === "number") {
      res.sendStatus(e);
    }
  }
});
