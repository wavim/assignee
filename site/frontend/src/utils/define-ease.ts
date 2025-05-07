const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)");
prefersReducedMotion.addEventListener("change", () => location.reload());

export function defineEase(ease: gsap.TweenVars): gsap.TweenVars {
	return prefersReducedMotion.matches
		? { duration: 0, immediateRender: false }
		: ease;
}
