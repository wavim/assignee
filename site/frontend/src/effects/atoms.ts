import { gsap } from "gsap";

export namespace atoms {
	export const fadein = (targets: gsap.TweenTarget, configs?: gsap.TweenVars) =>
		gsap.fromTo(
			targets,
			{ opacity: 0 },
			{
				opacity: 1,

				duration: 1,
				stagger: 0.1,
				ease: "power3.out",

				...configs,
			},
		);

	export const fadeout = (
		targets: gsap.TweenTarget,
		configs?: gsap.TweenVars,
	) =>
		gsap.fromTo(
			targets,
			{ opacity: 1 },
			{
				opacity: 0,

				duration: 1,
				stagger: 0.1,
				ease: "power3.out",

				...configs,
			},
		);

	export const moveup = (targets: gsap.TweenTarget, configs?: gsap.TweenVars) =>
		gsap.fromTo(
			targets,
			{ translateY: "100%" },
			{
				translateY: 0,

				duration: 1,
				stagger: 0.1,
				ease: "power3.out",

				...configs,
			},
		);

	export const rollup = (targets: gsap.TweenTarget, configs?: gsap.TweenVars) =>
		gsap.fromTo(
			targets,
			{ rotateX: "-80deg" },
			{
				rotateX: 0,

				duration: 1,
				stagger: 0.1,
				ease: "power3.out",

				...configs,
			},
		);
}
