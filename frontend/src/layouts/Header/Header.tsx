import { A } from "@solidjs/router";
import { gsap } from "gsap";
import { onMount } from "solid-js";
import { ease } from "../../configs/media";
import { Props } from "../../types/props";
import Logo from "../../atoms/Logo";
import A11y from "../A11y/A11y";
import I18n from "./I18n";

export default () => {
	let bg!: HTMLDivElement;
	let nav!: HTMLAnchorElement;

	onMount(() => {
		gsap.timeline({
			scrollTrigger: {
				start: window.innerHeight * 0.05,
				toggleActions: "play none none reverse",
			},
			defaults: ease({ duration: 0.6, ease: "power3.inOut" }),
		})
			.fromTo(
				bg,
				{ opacity: 0, scaleX: 1.05, scaleY: 1.3 },
				{ opacity: 1, scaleX: 1, scaleY: 1 },
			)
			.fromTo(
				nav,
				{ clipPath: "rect(0 100% 100% 0)", translateX: 0 },
				{ clipPath: "rect(0 19.5% 100% 0)", translateX: "40.5%" },
				"<",
			);
	});

	return (
		<I18n.I18n>
			<div class="mb-24"></div>
			<header class="fixed mt-2 flex h-16 w-[95%] items-center justify-center">
				<div
					ref={bg}
					class="bg-overlay/75 shadow-overlay-shadow absolute h-full w-full rounded-full shadow-xl/10 backdrop-blur-lg"
				></div>
				<Link
					ref={nav}
					class="h-1/2"
				></Link>
				<A11y class="absolute right-5 h-1/2"></A11y>
			</header>
		</I18n.I18n>
	);
};

const Link = (props: Props<"a">) => {
	const t = I18n.useI18n();

	return (
		<A
			{...props}
			href="/"
			title={t("link")}
		>
			<Logo class="fill-text-major h-full"></Logo>
		</A>
	);
};
