import { resMedia } from "./media";

export function ease(ease: gsap.TweenVars): gsap.TweenVars {
	return resMedia("rdmotion") ? { duration: 1e-6 } : ease;
}
