export function isInView(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	return rect.top < window.innerHeight && rect.bottom >= 0;
}
