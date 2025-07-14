import { media } from "./media";

export function ease(ease: gsap.TweenVars): gsap.TweenVars {
	return media.getReduceMotion("eval") === "on" ? { duration: 1e-6 } : ease;
}
