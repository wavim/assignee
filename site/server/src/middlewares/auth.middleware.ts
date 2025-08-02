// @ts-types="@types/express"
import { RequestHandler } from "express";

import { Bearer } from "@schema";
import { ErrorCode, HttpError } from "@wvm/http-error";
import { flattenError } from "zod";
import { config } from "/config/config.ts";
import { prisma } from "/db/client.ts";
import { hashMatch } from "/utils/crypt.ts";
import { expired } from "/utils/time.ts";

export const authenticate: RequestHandler = async (req, res, next) => {
  const { success, error, data } = Bearer.safeParse(req.cookies.bearer);

  if (!success) {
    return res.status(400).json(flattenError(error));
  }

  try {
    const session = await prisma.session.findUnique({
      where: { sid: data.sid },
      select: { hash: true, salt: true, created: true },
    });

    if (!session) {
      throw new HttpError("UNAUTHORIZED", "Session not found.");
    }

    if (expired(session, config.sessionAge)) {
      throw new HttpError("UNAUTHORIZED", "Session expired.");
    }

    if (!hashMatch(data.key, session)) {
      throw new HttpError("UNAUTHORIZED", "Invalid session key.");
    }

    next();
  } catch (e) {
    if (e instanceof HttpError) {
      return res.status(e.status).send(e.message);
    }
    res.sendStatus(ErrorCode.INTERNAL_SERVER_ERROR);
  }
};
