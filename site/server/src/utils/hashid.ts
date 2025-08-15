import Hashids from "hashids";

export class HashID {
	constructor(
		salt: string,
		private hash = new Hashids(salt, 8),
	) {}

	encode(num: number): string {
		return this.hash.encode(num);
	}

	decode(key: string): number {
		return Number(this.hash.decode(key)[0]);
	}
}
