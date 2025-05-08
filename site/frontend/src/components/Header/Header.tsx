import { A } from "@solidjs/router";
import { gsap } from "gsap";
import { onMount } from "solid-js";

import { defineEase } from "../../utils/define-ease";

import Logo from "../Logo/Logo";
import Accessibility from "./Accessibility/Accessibility";
import Menu from "./Menu/Menu";
import AccessibilityOptions from "./AccessibilityOptions/AccessibilityOptions";

export default () => {
	let extrapad!: HTMLDivElement;
	let header!: HTMLElement;
	let backdrop!: HTMLDivElement;
	let homenav!: HTMLAnchorElement;
	let accessibilityOptions!: HTMLDivElement;

	onMount(() => {
		const scroll = gsap.timeline({
			scrollTrigger: {
				start: window.innerHeight * 0.05,
				onLeaveBack: () => scroll.reverse(),
			},
			defaults: defineEase({ duration: 0.6, ease: "power3.inOut" }),
		});

		scroll
			.fromTo(
				backdrop,
				{ opacity: 0, scaleX: 1.02, scaleY: 1.2 },
				{ opacity: 1, scaleX: 1, scaleY: 1 },
			)
			.fromTo(
				homenav,
				{ clipPath: "rect(0 100% 100% 0)", translateX: 0 },
				{ clipPath: "rect(0 21% 100% 0)", translateX: "42%" },
				"<",
			);
	});

	return (
		<>
			<div
				ref={extrapad}
				class="h-0 w-full"
			></div>
			<header
				ref={header}
				class="z-top fixed mt-2 flex h-16 w-[95vw] items-center justify-center"
			>
				<div
					ref={backdrop}
					class="bg-header-bg/35 absolute top-0 right-0 left-0 -z-10 box-content h-full w-full rounded-2xl opacity-0 backdrop-blur-sm"
				></div>
				<Menu class="absolute left-4 h-full"></Menu>
				<A
					ref={homenav}
					href="/home"
					aria-label="Navigate to Home"
					class="h-1/2"
				>
					<Logo class="text-text-primary h-full"></Logo>
				</A>
				<div class="absolute right-4 h-1/2">
					<Accessibility
						ontoggle={(shown) => {
							const padding = gsap.timeline({
								defaults: defineEase({ duration: 0.6, ease: "power3.inOut" }),
							});

							padding
								.fromTo(extrapad, { height: 0 }, { height: "7rem" })
								.fromTo(
									backdrop,
									{ paddingBottom: 0 },
									{ paddingBottom: "7rem" },
									"<",
								)
								.fromTo(
									accessibilityOptions,
									{ opacity: 0 },
									{ opacity: 1 },
									"<50%",
								);

							if (!shown) padding.progress(1).reverse();
						}}
					></Accessibility>
				</div>
				<AccessibilityOptions ref={accessibilityOptions}></AccessibilityOptions>
			</header>
		</>
	);
};
