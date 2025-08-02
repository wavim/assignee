export function elapsed(from: Date): number {
  return Date.now() - Number(from);
}

export function expired({ created }: { created: Date }, min: number): boolean {
  return elapsed(created) > min * 60e3;
}

export function addtime(min: number): Date {
  return new Date(Date.now() + min * 60e3);
}

export function subtime(min: number): Date {
  return addtime(-min);
}
