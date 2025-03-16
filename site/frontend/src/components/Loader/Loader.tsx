import { gsap } from "gsap";
import { createSignal, onMount, Show } from "solid-js";

import Logo from "../Logo/Logo";

export default (props: { loadPromise: Promise<void> }) => {
	let screen!: HTMLDivElement;
	let mask!: HTMLDivElement;
	let logo!: Element;
	let attrib!: HTMLSpanElement;

	const [isShown, setIsShown] = createSignal(true);

	onMount(async () => {
		document.body.classList.add("overflow-y-hidden");
		await new Promise((res) => {
			const inTL = gsap.timeline({ onComplete: res });

			inTL.fromTo(
				[logo, attrib],
				{ opacity: 0, translateY: "100%", rotateX: "80deg" },
				{
					opacity: 1,
					translateY: 0,
					rotateX: 0,
					duration: 0.8,
					ease: "power2.out",
					stagger: 0.1,
				},
			);
		});

		await props.loadPromise;
		const fadeTL = gsap.timeline({
			onComplete: () => {
				setIsShown(false);
				document.body.classList.remove("overflow-y-hidden");
			},
		});
		fadeTL.fromTo(
			screen,
			{
				clipPath:
					"polygon(0% 0%, 0% 100%, 5% 50%, 15% 50%, 95% 50%, 85% 50%, 0% 50%, 0% 100%, 100% 100%, 100% 0%)",
			},
			{
				clipPath:
					"polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0 100%, 100% 100%, 100% 0%)",
				duration: 1.2,
				ease: "expo.inOut",
			},
			">",
		);
		fadeTL.fromTo(
			mask,
			{ opacity: 1 },
			{
				opacity: 0,
				duration: 1.2,
				ease: "expo.inOut",
				onStart: () => {
					const revealEvent = new CustomEvent("pageReveal");
					window.dispatchEvent(revealEvent);
				},
			},
			"<",
		);
	});

	return (
		<Show when={isShown()}>
			<div class="fixed z-[1000] h-screen w-full">
				<div
					class="bg-p-dark dark:bg-p-light pointer-events-none absolute -z-[1] h-full w-full"
					ref={mask}
				></div>
				<div
					class="bg-p-light dark:bg-p-dark flex h-full w-full flex-col items-center justify-center"
					ref={screen}
				>
					<Logo
						class="text-p-dark dark:text-p-light -mt-16 w-1/3 origin-[center_top] transform-3d sm:w-1/5"
						ref={logo}
					></Logo>
					<span
						class="text-p-dark font-primary dark:text-p-light py-5 text-xl font-medium sm:text-2xl"
						ref={attrib}
					>
						Presented by CarbonicSoda
					</span>
				</div>
			</div>
		</Show>
	);
};
