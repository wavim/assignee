import { k12 } from "@noble/hashes/sha3-addons";
import { Input, randomBytes } from "@noble/hashes/utils";
import { equal } from "./buffer.ts";

export function hashPair(
  data: Input,
  salt = randomBytes(16),
): {
  hash: Uint8Array;
  salt: Uint8Array;
} {
  const hash = k12(data, {
    dkLen: 32,
    personalization: salt,
  });

  return { hash, salt };
}

export function hashMatch(
  data: Input,
  { hash, salt }: {
    hash: Uint8Array;
    salt: Uint8Array;
  },
): boolean {
  return equal(hash, hashPair(data, salt).hash);
}
