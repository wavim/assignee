import Hashids from "hashids";

export function encode(hashid: Hashids, id: number): string {
	return hashid.encode(id);
}

export function decode(hashid: Hashids, id: string): number {
	return Number(hashid.decode(id)[0]);
}
