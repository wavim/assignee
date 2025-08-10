export function sort<T>(array: T[], fn: (item: T) => string | number): T[] {
	return array.sort((a, b) => {
		const x = fn(a);
		const y = fn(b);

		return x === y ? 0 : x > y ? 1 : -1;
	});
}
