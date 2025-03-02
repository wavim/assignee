export namespace TimeUtils {
	export function now(): bigint {
		return BigInt(Date.now()) / 1000n;
	}

	export function elapsed(from: bigint): bigint {
		return now() - from;
	}

	export function convert(
		time: {
			day?: number;
			hour?: number;
			min?: number;
		},
		to: "s" | "ms" = "s",
	): number {
		const sec =
			(time.day ?? 0) * 24 * 3600 +
			(time.hour ?? 0) * 3600 +
			(time.min ?? 0) * 60;
		return to === "s" ? sec : sec * 1000;
	}

	export function getDateAfter(time: {
		day?: number;
		hour?: number;
		min?: number;
	}): Date {
		return new Date(Date.now() + convert(time, "ms"));
	}

	export function isExpired(
		from: bigint,
		expiry: {
			day?: number;
			hour?: number;
			min?: number;
		},
	): boolean {
		return elapsed(from) > convert(expiry);
	}
}
