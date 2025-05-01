import { A } from "@solidjs/router";
import { gsap } from "gsap";
import { onMount, Ref } from "solid-js";

import { atoms } from "../../effects/atoms";
import { reveal } from "../../utils/reveal";
import Logo from "../Logo/Logo";
import Accessibility from "./Accessibility/Accessibility";
import Menu from "./Menu/Menu";

export default () => {
	let header!: Ref<HTMLElement>;
	let backdrop!: Ref<HTMLDivElement>;
	let homenav!: Ref<HTMLAnchorElement>;

	onMount(async () => {
		await reveal();

		const tl = gsap.timeline();

		tl.add(atoms.fadein(header, { delay: 0.8 }));

		const ease: gsap.TweenVars = { duration: 0.6, ease: "power3.inOut" };
		const scroll = gsap.timeline({
			scrollTrigger: {
				start: window.innerHeight * 0.2,
				onLeaveBack: () => scroll.reverse(),
			},
		});

		scroll
			.add(atoms.fadein(backdrop, ease))
			.fromTo(
				backdrop,
				{ scaleX: 1.02, scaleY: 1.2 },
				{ scaleX: 1, scaleY: 1, ...ease },
				"<",
			)
			.fromTo(
				homenav,
				{ clipPath: "rect(0 100% 100% 0)", translateX: 0 },
				{ clipPath: "rect(0 21% 100% 0)", translateX: "42%", ...ease },
				"<",
			);
	});

	return (
		<header
			ref={header}
			class="z-top fixed mt-5 flex h-24 w-[97vw] items-center justify-between self-center"
		>
			<div
				ref={backdrop}
				class="bg-s-light/60 absolute top-0 right-0 left-0 -z-10 h-full w-full rounded-2xl backdrop-blur-xl"
			></div>
			<Menu></Menu>
			<A
				ref={homenav}
				href="/home"
				aria-label="Navigate to home"
				class="h-1/2"
			>
				<Logo class="text-p-dark h-full"></Logo>
			</A>
			<Accessibility></Accessibility>
		</header>
	);
};
