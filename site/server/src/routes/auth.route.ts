// @ts-types="@types/express"
import { Router } from "express";

import { AuthId, Bearer } from "@schema";
import { ErrorCode, HttpError } from "@wvm/http-error";
import { rateLimit } from "express-rate-limit";
import { flattenError } from "zod";
import { authenticate } from "/middlewares/auth.middleware.ts";
import { rotate, signin, signup } from "/services/auth.service.ts";
import { bearer } from "/utils/cookie.ts";

export const auth = Router();

const limRotate = rateLimit({ skipSuccessfulRequests: true });
const limSigner = rateLimit();

auth.post("/rotate", limRotate, authenticate, async (req, res) => {
  const { success, error, data } = Bearer.safeParse(req.cookies.bearer);

  if (!success) {
    return res.status(400).json(flattenError(error));
  }

  try {
    res.cookie(...bearer(await rotate(data))).end();
  } catch (e) {
    if (e instanceof HttpError) {
      return res.status(e.status).send(e.message);
    }
    res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
  }
});

auth.post("/signin", limSigner, async (req, res) => {
  const { success, error, data } = AuthId.safeParse(req.body);

  if (!success) {
    return res.status(400).json(flattenError(error));
  }

  try {
    res.cookie(...bearer(await signin(data))).end();
  } catch (e) {
    if (e instanceof HttpError) {
      return res.status(e.status).send(e.message);
    }
    res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
  }
});

auth.post("/signup", limSigner, async (req, res) => {
  const { success, error, data } = AuthId.safeParse(req.body);

  if (!success) {
    return res.status(400).json(flattenError(error));
  }

  try {
    res.cookie(...bearer(await signup(data))).end();
  } catch (e) {
    if (e instanceof HttpError) {
      return res.status(e.status).send(e.message);
    }
    res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
  }
});
