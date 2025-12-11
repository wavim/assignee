import { kt128 } from "@noble/hashes/sha3-addons.js";
import { bytesToHex, randomBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { equal } from "./buffer";

export function randk(): string {
	return bytesToHex(randomBytes(32));
}

export function chash(key: string, salt = randomBytes(16)): { hash: Uint8Array; salt: Uint8Array } {
	return { hash: kt128(utf8ToBytes(key), { personalization: salt }), salt };
}

export function match(key: string, hash: Uint8Array, salt: Uint8Array): boolean {
	return equal(hash, chash(key, salt).hash);
}
