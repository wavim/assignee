import { Buffer } from "buffer";

export function equal(buff1: Uint8Array, buff2: Uint8Array): boolean {
	return Buffer.compare(buff1, buff2) === 0;
}
