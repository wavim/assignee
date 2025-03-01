import { k12 } from "@noble/hashes/sha3-addons";
import { randomBytes as _randomBytes } from "@noble/hashes/utils";

export namespace CryptUtils {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	export function randomBytes(count: number): Uint8Array {
		return _randomBytes(count);
	}

	export function randomToken(length: number): string {
		return decode(randomBytes(length));
	}

	export function randomDigits(count: number): Uint8Array {
		return randomBytes(count).map((b) => Math.trunc((10 * b) / 256));
	}

	export function randomCode(length: number): string {
		return randomDigits(length).join("");
	}

	export function hash(key: string, salt: Uint8Array): Uint8Array {
		return k12(key, { personalization: salt, dkLen: 32 });
	}

	export function areHashesEqual(hash1: Uint8Array, hash2: Uint8Array): boolean {
		if (hash1.length !== hash2.length) return false;
		for (let i = 0; i < hash1.length; i++) {
			if (hash1[i] !== hash2[i]) return false;
		}
		return true;
	}

	export function encode(str: string): Uint8Array {
		return encoder.encode(str);
	}

	export function decode(uint8array: Uint8Array): string {
		return decoder.decode(uint8array);
	}
}
