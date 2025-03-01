export namespace TimeUtils {
	export function now(): bigint {
		return BigInt(Date.now()) / 1000n;
	}

	export function elapsed(from: bigint): bigint {
		return now() - from;
	}

	export function isExpired(
		from: bigint,
		expiry: {
			d?: number;
			h?: number;
			m?: number;
		},
	): boolean {
		const _expiry = (expiry.d ?? 0) * 24 * 3600 + (expiry.h ?? 0) * 3600 + (expiry.m ?? 0) * 60;
		return elapsed(from) > _expiry;
	}
}
