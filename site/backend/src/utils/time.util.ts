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
			day?: number;
			hour?: number;
			min?: number;
		},
	): boolean {
		const _expiry =
			(expiry.day ?? 0) * 24 * 3600 +
			(expiry.hour ?? 0) * 3600 +
			(expiry.min ?? 0) * 60;
		return elapsed(from) > _expiry;
	}
}
