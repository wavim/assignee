import { gsap } from "gsap";

//#region in animations
gsap.registerEffect({
	name: "rollIn",
	effect: (targets: gsap.TweenTarget, configs?: gsap.TweenVars) => {
		return gsap.fromTo(
			targets,
			{ opacity: 0, translateY: "100%", rotateX: "-80deg" },
			{
				opacity: 1,
				translateY: 0,
				rotateX: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: "power2.out",
				...configs,
			},
		);
	},
	extendTimeline: true,
});
gsap.registerEffect({
	name: "blurIn",
	effect: (targets: gsap.TweenTarget, configs?: gsap.TweenVars) => {
		return gsap.fromTo(
			targets,
			{ opacity: 0, translateY: "100%", filter: "blur(0.6rem)" },
			{
				opacity: 1,
				translateY: 0,
				filter: "blur(0rem)",
				delay: 0.6,
				duration: 1.6,
				stagger: 0.06,
				ease: "circ.out",
				...configs,
			},
		);
	},
	extendTimeline: true,
});
//#endregion in animations

//#region out animations
gsap.registerEffect({
	name: "fadeOut",
	effect: (targets: gsap.TweenTarget, configs?: gsap.TweenVars) => {
		return gsap.fromTo(
			targets,
			{ opacity: 1 },
			{ opacity: 0, duration: 1.2, ease: "expo.inOut", ...configs },
		);
	},
	extendTimeline: true,
});
//#endregion out animations
