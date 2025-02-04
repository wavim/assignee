export function getTimestamp(): bigint {
	return BigInt(Date.now()) / 1000n;
}
