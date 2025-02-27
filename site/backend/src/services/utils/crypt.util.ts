import { k12 } from "@noble/hashes/sha3-addons";
import { randomBytes as _randomBytes } from "@noble/hashes/utils";

export namespace CryptUtils {
	export function randomBytes(count: number): Uint8Array {
		return _randomBytes(count);
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
}
