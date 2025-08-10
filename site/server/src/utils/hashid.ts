import { CONFIG } from "../configs/configs";

export function encode(id: number): string {
	return CONFIG.HASH_IDS.encode(id);
}

export function decode(id: string): number {
	return Number(CONFIG.HASH_IDS.decode(id)[0]);
}
