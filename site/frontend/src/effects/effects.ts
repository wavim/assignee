import { gsap } from "gsap";

import { atoms } from "./atoms";

export namespace effects {
	export const blurin = (
		targets: gsap.TweenTarget,
		tweenvars?: gsap.TweenVars,
		timevars?: gsap.TimelineVars,
	) => {
		const ease: gsap.TweenVars = {
			duration: 1.6,
			ease: "circ.out",
			...tweenvars,
		};

		const tl = gsap.timeline(timevars);

		tl.add(atoms.fadein(targets, ease))
			.add(atoms.moveup(targets, ease), "<")
			.add(atoms.blurin(targets, ease), "<");

		return tl;
	};

	export const rollin = (
		targets: gsap.TweenTarget,
		tweenvars?: gsap.TweenVars,
		timevars?: gsap.TimelineVars,
	) => {
		const ease: gsap.TweenVars = { duration: 0.8, ...tweenvars };

		const tl = gsap.timeline(timevars);

		tl.add(atoms.fadein(targets, ease))
			.add(atoms.moveup(targets, ease), "<")
			.add(atoms.rollup(targets, ease), "<");

		return tl;
	};

	export namespace scanin {
		const ease: gsap.TweenVars = { duration: 1.2, ease: "power4.out" };

		export const parent = (
			targets: gsap.TweenTarget,
			tweenvars?: gsap.TweenVars,
			timevars?: gsap.TimelineVars,
		) => {
			const tl = gsap.timeline(timevars);

			tl.add(atoms.scanin(targets, { ...ease, ...tweenvars }));

			return tl;
		};

		export const child = (
			targets: gsap.TweenTarget,
			tweenvars?: gsap.TweenVars,
			timevars?: gsap.TimelineVars,
		) => {
			const tl = gsap.timeline(timevars);

			tl.add(atoms.moveup(targets, { ...ease, ...tweenvars }));

			return tl;
		};
	}
}
