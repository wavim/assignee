import { A } from "@solidjs/router";
import { gsap } from "gsap";
import { onMount, Ref } from "solid-js";

import Logo from "../Logo/Logo";
import Accessibility from "./Accessibility/Accessibility";
import Menu from "./Menu/Menu";

export default () => {
	let header!: Ref<HTMLElement>;
	let backdrop!: Ref<HTMLDivElement>;
	let homenav!: Ref<HTMLAnchorElement>;

	onMount(() => {
		const scroll = gsap.timeline({
			scrollTrigger: {
				start: window.innerHeight * 0.2,
				onLeaveBack: () => scroll.reverse(),
			},
		});

		const ease: gsap.TweenVars = { duration: 0.6, ease: "power3.inOut" };

		scroll
			.fromTo(
				backdrop,
				{ opacity: 0, scaleX: 1.02, scaleY: 1.2 },
				{ opacity: 1, scaleX: 1, scaleY: 1, ...ease },
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
			class="z-top fixed mt-2 flex h-12 w-[96vw] items-center justify-between self-center"
		>
			<div
				ref={backdrop}
				class="bg-header-bg/40 absolute top-0 right-0 left-0 -z-10 h-full w-full rounded-2xl backdrop-blur-xl"
			></div>
			<Menu></Menu>
			<A
				ref={homenav}
				href="/home"
				aria-label="navigate to home"
				class="h-1/2"
			>
				<Logo class="text-text-primary h-full"></Logo>
			</A>
			<Accessibility></Accessibility>
		</header>
	);
};
