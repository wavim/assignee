import { gsap } from "gsap";
import { createSignal, onMount, Show } from "solid-js";

import { ease } from "../../accessibility/ease";

import Accessibility from "./Accessibility/Accessibility";
import HomeNav from "./HomeNav/HomeNav";
import I18n from "./I18n";
import Menu from "./Menu/Menu";
import Options from "./Options/Options";

export default () => {
	let extrapad!: HTMLDivElement;
	let header!: HTMLElement;
	let backdrop!: HTMLDivElement;
	let homenav!: HTMLAnchorElement;
	let accessibilityOptions!: HTMLDivElement;

	const [showAccessibility, setShowAccessibilty] = createSignal(false);

	onMount(() => {
		const scroll = gsap.timeline({
			scrollTrigger: {
				start: window.innerHeight * 0.05,
				onLeaveBack: () => scroll.reverse(),
			},
			defaults: ease({ duration: 0.6, ease: "power3.inOut" }),
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
		<I18n>
			<div
				ref={extrapad}
				class="h-0 w-full"
			></div>
			<header
				ref={header}
				class="z-inf fixed mt-2 flex h-16 w-[95vw] items-center justify-center"
			>
				<div
					ref={backdrop}
					class="bg-header-bg/35 absolute top-0 right-0 left-0 -z-10 box-content h-full w-full rounded-2xl backdrop-blur-sm"
				></div>
				<Menu class="absolute left-4 h-full"></Menu>
				<HomeNav ref={homenav}></HomeNav>
				<div class="absolute right-4 h-1/2">
					<Accessibility
						ontoggle={(show) => {
							if (show) setShowAccessibilty(true);

							const padding = gsap.timeline({
								defaults: ease({ duration: 0.6, ease: "power3.inOut" }),
								onReverseComplete: () => void setShowAccessibilty(false),
							});

							padding
								.fromTo(extrapad, { height: 0 }, { height: "12rem" })
								.fromTo(
									backdrop,
									{ paddingBottom: 0 },
									{ paddingBottom: "12rem" },
									"<",
								)
								.fromTo(
									accessibilityOptions,
									{ opacity: 0 },
									{ opacity: 1 },
									"<50%",
								);

							if (!show) padding.progress(1).reverse();
						}}
					></Accessibility>
				</div>
				<Show when={showAccessibility()}>
					<Options
						ref={accessibilityOptions}
					></Options>
				</Show>
			</header>
		</I18n>
	);
};
