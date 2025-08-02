import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import { zAuthId, zBearer } from "@schema";
import { HttpError } from "@wvm/http-error";
import { prisma } from "/db/client.ts";
import { hashMatch, hashPair } from "/utils/crypt.ts";

async function session(uid: number): Promise<zBearer> {
  const key = bytesToHex(randomBytes(32));

  const { sid } = await prisma.session.create({
    data: { uid, ...hashPair(key) },
    select: { sid: true },
  });

  return { sid, key };
}

export async function signin({ eml, pwd }: zAuthId): Promise<zBearer> {
  const user = await prisma.user.findUnique({
    where: { email: eml },
    select: { uid: true, password: true },
  });

  if (!user) {
    throw new HttpError("UNAUTHORIZED", "Incorrect email or password.");
  }

  if (!user.password) {
    throw new HttpError("INTERNAL_SERVER_ERROR", `Lost ${eml} password entry.`);
  }

  if (!hashMatch(pwd, user.password)) {
    throw new HttpError("UNAUTHORIZED", "Incorrect email or password.");
  }

  return await session(user.uid);
}

export async function signup({ eml, pwd }: zAuthId): Promise<zBearer> {
  let uid;

  try {
    const user = await prisma.user.create({
      data: { email: eml, name: eml.split("@", 1)[0] },
      select: { uid: true },
    });
    uid = user.uid;
  } catch {
    throw new HttpError("CONFLICT", "Email already in use.");
  }

  try {
    await prisma.password.create({
      data: { uid, ...hashPair(pwd) },
      select: {},
    });
  } catch {
    throw new HttpError(
      "INTERNAL_SERVER_ERROR",
      `Cannot create ${eml} password.`,
    );
  }

  return await session(uid);
}

export async function rotate({ sid }: zBearer): Promise<zBearer> {
  const {
    uid,
  } = await prisma.session.delete({ where: { sid }, select: { uid: true } });

  return await session(uid);
}
