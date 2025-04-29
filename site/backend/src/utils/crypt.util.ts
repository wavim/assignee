import { k12 } from "@noble/hashes/sha3-addons";
import { randomBytes as _randomBytes, bytesToHex } from "@noble/hashes/utils";

export namespace CryptUtil {
	export function randomBytes(count: number): Uint8Array {
		return _randomBytes(count);
	}

	export function randomDigits(count: number): Uint8Array {
		return randomBytes(count).map((b) => Math.trunc((10 * b) / 256));
	}

	export function randomDecCode(length: number): string {
		return randomDigits(length).join("");
	}

	export function randomHexCode(length: number): string {
		return bytesToHex(randomBytes(length));
	}

	export function hash(key: string, salt: Uint8Array): Uint8Array {
		return k12(key, { personalization: salt, dkLen: 32 });
	}

	export function areHashesEqual(
		hash1: Uint8Array,
		hash2: Uint8Array,
	): boolean {
		if (hash1.length !== hash2.length) return false;
		for (let i = 0; i < hash1.length; i++) {
			if (hash1[i] !== hash2[i]) return false;
		}
		return true;
	}
}
