export function elapsed(from: Date): number {
	return Date.now() - Number(from);
}

export function expired(from: Date, min: number): boolean {
	return elapsed(from) > min * 60e3;
}

export function addtime(min: number): Date {
	return new Date(Date.now() + min * 60e3);
}

export function subtime(min: number): Date {
	return addtime(-min);
}
