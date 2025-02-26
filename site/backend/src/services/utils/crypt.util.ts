import { k12 } from "@noble/hashes/sha3-addons";
import { randomBytes } from "@noble/hashes/utils";

export namespace CryptUtil {
	export function random(byteLength: number): Uint8Array {
		return randomBytes(byteLength);
	}

	export function randomCode(length: number): string {
		return randomBytes(length)
			.map((b) => +`${b}`.at(-1)!)
			.join("");
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
