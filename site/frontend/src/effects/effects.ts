import { gsap } from "gsap";
import { atoms } from "./atoms";

export namespace effects {
	export const rollin = (
		targets: gsap.TweenTarget,
		configs?: gsap.TimelineVars,
	) => {
		const tl = gsap.timeline({ defaults: { duration: 0.8 }, ...configs });

		tl.add(atoms.fadein(targets))
			.add(atoms.moveup(targets), "<")
			.add(atoms.rollup(targets), "<");

		return tl;
	};
}

// gsap.registerEffect({
// 	name: "blurIn",
// 	effect: (targets: gsap.TweenTarget, configs?: gsap.TweenVars) => {
// 		return gsap.fromTo(
// 			targets,
// 			{ opacity: 0, translateY: "100%", filter: "blur(0.3rem)" },
// 			{
// 				opacity: 1,
// 				translateY: 0,
// 				filter: "blur(0rem)",
// 				duration: TIMES.blurIn,
// 				delay: TIMES.blurInDelay,
// 				stagger: TIMES.blurInStagger,
// 				ease: "circ.out",
// 				...configs,
// 			},
// 		);
// 	},
// 	extendTimeline: true,
// });
// gsap.registerEffect({
// 	name: "scanIn",
// 	effect: (targets: gsap.TweenTarget, configs?: gsap.TweenVars) => {
// 		return gsap.fromTo(
// 			targets,
// 			{ translateY: "100%", clipPath: "polygon(0 0,100% 0,100% 0,0 50%)" },
// 			{
// 				translateY: 0,
// 				clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
// 				duration: TIMES.blurIn,
// 				delay: TIMES.blurInDelay,
// 				stagger: TIMES.blurInStagger,
// 				ease: "circ.out",
// 				...configs,
// 			},
// 		);
// 	},
// 	extendTimeline: true,
// });

// //#region out animations
// gsap.registerEffect({
// 	name: "fadeOut",
// 	effect: (targets: gsap.TweenTarget, configs?: gsap.TweenVars) => {
// 		return gsap.fromTo(
// 			targets,
// 			{ opacity: 1 },
// 			{ opacity: 0, duration: TIMES.fadeOut, ease: "expo.inOut", ...configs },
// 		);
// 	},
// 	extendTimeline: true,
// });
// //#endregion out animations
