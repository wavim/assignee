import { k12 } from "@noble/hashes/sha3-addons";
import { bytesToHex, Input, randomBytes } from "@noble/hashes/utils";
import { equal } from "./buffer";

export function randk(): string {
	return bytesToHex(randomBytes(32));
}

export function chash(key: Input, salt = randomBytes(16)): { hash: Uint8Array; salt: Uint8Array } {
	return { hash: k12(key, { dkLen: 32, personalization: salt }), salt };
}

export function match(key: Input, hash: Uint8Array, salt: Uint8Array): boolean {
	return equal(hash, chash(key, salt).hash);
}
