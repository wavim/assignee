import { gsap } from "gsap";

export namespace atoms {
	const ease: gsap.TweenVars = {
		duration: 1,
		stagger: 0.1,
		ease: "power3.out",
	};

	export const fadein = (
		targets: gsap.TweenTarget,
		configs?: gsap.TweenVars,
	) => {
		return gsap.fromTo(
			targets,
			{ opacity: 0 },
			{ opacity: 1, ...ease, ...configs },
		);
	};

	export const fadeout = (
		targets: gsap.TweenTarget,
		configs?: gsap.TweenVars,
	) => {
		return gsap.fromTo(
			targets,
			{ opacity: 1 },
			{ opacity: 0, ...ease, ...configs },
		);
	};

	export const moveup = (
		targets: gsap.TweenTarget,
		configs?: gsap.TweenVars,
	) => {
		return gsap.fromTo(
			targets,
			{ translateY: "100%" },
			{ translateY: 0, ...ease, ...configs },
		);
	};

	export const rollup = (
		targets: gsap.TweenTarget,
		configs?: gsap.TweenVars,
	) => {
		return gsap.fromTo(
			targets,
			{ rotateX: "-80deg" },
			{ rotateX: 0, ...ease, ...configs },
		);
	};

	export const blurin = (
		targets: gsap.TweenTarget,
		configs?: gsap.TweenVars,
	) => {
		return gsap.fromTo(
			targets,
			{ filter: "blur(0.5rem)" },
			{ filter: "blur(0rem)", ...ease, ...configs },
		);
	};

	export const scanin = (
		targets: gsap.TweenTarget,
		configs?: gsap.TweenVars,
	) => {
		return gsap.fromTo(
			targets,
			{ clipPath: "polygon(0 0,100% 0,100% 0,0 50%)" },
			{
				clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
				...ease,
				...configs,
			},
		);
	};
}
