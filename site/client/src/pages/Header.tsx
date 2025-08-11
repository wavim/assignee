import { A } from "@solidjs/router";
import { gsap } from "gsap";
import { onMount } from "solid-js";
import { ease } from "../configs/media";
import A11y from "../gui/A11y";
import { defineI18n } from "../gui/I18n";
import Logo from "../gui/Logo";
import { Props } from "../types/props";

const I18n = defineI18n({ en: { home: "Homepage" }, zh: { home: "首頁" } });

export default () => {
	let bg!: HTMLDivElement;
	let link!: HTMLAnchorElement;

	onMount(() => {
		gsap
			.timeline({
				defaults: ease({ duration: 0.6, ease: "power3.inOut" }),
				scrollTrigger: { start: "2.5%", toggleActions: "play none none reverse" },
			})
			.fromTo(bg, { opacity: 0, scaleX: 1.05, scaleY: 1.2 }, { opacity: 1, scaleX: 1, scaleY: 1 })
			.fromTo(
				link,
				{ clipPath: "rect(0 100% 100% 0)", translateX: 0 },
				{ clipPath: "rect(0 19.5% 100% 0)", translateX: "40.5%" },
				"<",
			);
	});

	return (
		<I18n.I18n>
			<header class="fixed top-2 z-50 flex h-16 w-[calc(100%-1rem)] items-center justify-center">
				<div
					ref={bg}
					class="bg-overlay/75 shadow-shadow absolute size-full rounded-full shadow-xl/10 backdrop-blur-lg"
				></div>
				<Link
					ref={link}
					class="h-1/2"
				></Link>
				<A11y class="absolute right-5 h-1/2"></A11y>
			</header>
			<div class="h-28 md:hidden"></div>
		</I18n.I18n>
	);
};

const Link = (props: Props<"a">) => (
	<A
		{...props}
		href="/"
		title={I18n.useI18n()("home")}
	>
		<Logo class="fill-text-major h-full"></Logo>
	</A>
);
