import { gsap } from "gsap";
import { createSignal, onMount } from "solid-js";

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
	let accessibility!: HTMLButtonElement;
	let options!: HTMLDivElement;

	const [showOptions, setShowOptions] = createSignal(false);

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
					class="bg-header-bg/35 absolute top-0 right-0 left-0 -z-10 box-content h-full w-full rounded-2xl backdrop-blur-lg"
				></div>
				<Menu class="absolute left-4 h-full"></Menu>
				<HomeNav ref={homenav}></HomeNav>
				<div class="absolute right-4 h-1/2">
					<Accessibility
						ref={accessibility}
						onclick={() => {
							accessibility.disabled = true;
							setTimeout(() => (accessibility.disabled = false), 600);

							const reveal = gsap.timeline({
								defaults: ease({ duration: 0.6, ease: "power3.inOut" }),
							});

							reveal
								.fromTo(extrapad, { height: 0 }, { height: "12rem" })
								.fromTo(
									backdrop,
									{ paddingBottom: 0 },
									{ paddingBottom: "12rem" },
									"<",
								)
								.fromTo(options, { opacity: 0 }, { opacity: 1 }, "<50%");

							if (showOptions()) reveal.progress(1).reverse();

							setShowOptions((show) => !show);
						}}
					></Accessibility>
				</div>
				<Options
					ref={options}
					enable={showOptions()}
					class="opacity-0"
				></Options>
			</header>
		</I18n>
	);
};
