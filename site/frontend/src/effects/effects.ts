import { gsap } from "gsap";
import { atoms } from "./atoms";

export namespace effects {
	export const rollin = (
		targets: gsap.TweenTarget,
		configs?: gsap.TimelineVars,
	) => {
		const ease: gsap.TweenVars = { duration: 0.8 };

		const tl = gsap.timeline(configs);

		tl.add(atoms.fadein(targets, ease))
			.add(atoms.moveup(targets, ease), "<")
			.add(atoms.rollup(targets, ease), "<");

		return tl;
	};

	export const blurin = (
		targets: gsap.TweenTarget,
		configs?: gsap.TimelineVars,
	) => {
		const ease: gsap.TweenVars = { duration: 1.6, ease: "circ.out" };

		const tl = gsap.timeline(configs);

		tl.add(atoms.fadein(targets, ease))
			.add(atoms.moveup(targets, ease), "<")
			.add(atoms.blurin(targets, ease), "<");

		return tl;
	};

	export namespace scanin {
		const ease: gsap.TweenVars = { duration: 1.2, ease: "power4.out" };

		export const parent = (
			targets: gsap.TweenTarget,
			configs?: gsap.TimelineVars,
		) => {
			const tl = gsap.timeline(configs);

			tl.add(atoms.scanin(targets, ease));

			return tl;
		};

		export const child = (
			targets: gsap.TweenTarget,
			configs?: gsap.TimelineVars,
		) => {
			const tl = gsap.timeline(configs);

			tl.add(atoms.moveup(targets, ease));

			return tl;
		};
	}
}

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
