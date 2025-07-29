import { k12 } from "@noble/hashes/sha3-addons";
import { Input, randomBytes } from "@noble/hashes/utils";
import { zAuthId, zBearer } from "@schema";
import { encodeBase64 } from "@std/encoding/base64";
import { Buffer } from "node:buffer";
import { prisma } from "/db/client.ts";

export async function signin({ eml, pwd }: zAuthId): Promise<zBearer> {
  const user = await prisma.user.findUnique({
    where: { email: eml },
    select: { uid: true, password: true },
  });

  if (!user?.password) {
    throw 401;
  }

  const { hash } = authpair(pwd, user.password.salt);

  if (Buffer.compare(hash, user.password.hash)) {
    throw 401;
  }

  return await session(user.uid);
}

export async function signup({ eml, pwd }: zAuthId): Promise<zBearer> {
  try {
    const { uid } = await prisma.user.create({
      data: { email: eml, name: eml.split("@", 1)[0] },
      select: { uid: true },
    });

    await prisma.password.create({ data: { uid, ...authpair(pwd) } });

    return await session(uid);
  } catch {
    throw 409;
  }
}

async function session(uid: number): Promise<zBearer> {
  const key = randomBytes(32);

  const { sid } = await prisma.session.create({
    data: { uid, ...authpair(key) },
    select: { sid: true },
  });

  return { sid, key: encodeBase64(key) };
}

// MO REF
function authpair(
  key: Input,
  salt = randomBytes(16),
): { hash: Uint8Array; salt: Uint8Array } {
  const hash = k12(key, {
    dkLen: 32,
    personalization: salt,
  });
  return { hash, salt };
}
