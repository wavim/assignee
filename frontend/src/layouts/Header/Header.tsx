import { A } from "@solidjs/router";
import { gsap } from "gsap";
import { onMount } from "solid-js";
import Logo from "../../atoms/Logo";
import { ease } from "../../configs/media";
import { Props } from "../../types/props";
import A11y from "../A11y/A11y";
import I18n from "./I18n";

export default () => {
	let bg!: HTMLDivElement;
	let link!: HTMLAnchorElement;

	onMount(() => {
		gsap.timeline({
			defaults: ease({ duration: 0.6, ease: "power3.inOut" }),
			scrollTrigger: { start: "2.5%", toggleActions: "play none none reverse" },
		})
			.fromTo(
				bg,
				{ opacity: 0, scaleX: 1.05, scaleY: 1.2 },
				{ opacity: 1, scaleX: 1, scaleY: 1 },
			)
			.fromTo(
				link,
				{ clipPath: "rect(0 100% 100% 0)", translateX: 0 },
				{ clipPath: "rect(0 19.5% 100% 0)", translateX: "40.5%" },
				"<",
			);
	});

	return (
		<I18n.I18n>
			<div class="h-28 md:h-40"></div>
			<header class="fixed top-2 flex h-16 w-[calc(100%-1rem)] items-center justify-center">
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
