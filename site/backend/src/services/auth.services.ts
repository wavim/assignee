import { k12 } from "@noble/hashes/sha3-addons";
import { randomBytes } from "@noble/hashes/utils";

export namespace AuthServices {
	export function hash(raw: string): { hash: Uint8Array; salt: Uint8Array } {
		const key = new TextEncoder().encode(raw);
		const salt = randomBytes(16);

		const concat = new Uint8Array(key.length + 16);
		concat.set(key);
		concat.set(salt, key.length);

		const hash = k12(concat, { dkLen: 32 });

		return { hash, salt };
	}
}
