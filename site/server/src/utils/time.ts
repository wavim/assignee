export interface Time {
	d?: number;
	h?: number;
	m?: number;
	s?: number;
}

export function ms(t: Time): number {
	const d = t.d ?? 0;
	const h = t.h ?? 0;
	const m = t.m ?? 0;
	const s = t.s ?? 0;

	return (d * 86400 + h * 3600 + m * 60 + s) * 1e3;
}

export function addtime(t: Time): Date {
	return new Date(Date.now() + ms(t));
}

export function subtime(t: Time): Date {
	return new Date(Date.now() - ms(t));
}

export function expired(c: Date, t: Time): boolean {
	return subtime(t) > c;
}
