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

	export function hash(raw: string, salt: Uint8Array): Uint8Array {
		const key = new TextEncoder().encode(raw);
		const concat = new Uint8Array(key.length + 16);
		concat.set(key);
		concat.set(salt, key.length);

		const hash = k12(concat, { dkLen: 32 });
		return hash;
	}
}
