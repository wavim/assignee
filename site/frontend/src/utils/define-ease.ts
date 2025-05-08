//MO TODO this will be toggle-able later
const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion)",
).matches;

export function defineEase(ease: gsap.TweenVars): gsap.TweenVars {
	return prefersReducedMotion ? { duration: 0, immediateRender: false } : ease;
}
