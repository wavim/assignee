import { media } from "./media";

export function ease(ease: gsap.TweenVars): gsap.TweenVars {
	return media.getReduceMotion("eval") === "on"
		? { duration: 0, immediateRender: false }
		: ease;
}
