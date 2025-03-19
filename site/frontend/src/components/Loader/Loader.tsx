import { gsap } from "gsap";
import { createSignal, onMount, Show } from "solid-js";

import Logo from "../Logo/Logo";

export default (props: { loadPromise: Promise<void> }) => {
	let screen!: HTMLDivElement;
	let mask!: HTMLDivElement;
	let logo!: SVGSVGElement;
	let attrib!: HTMLSpanElement;

	const [isShown, setIsShown] = createSignal(true);

	onMount(async () => {
		//MO DEV hide loader
		setIsShown(false);

		document.body.classList.add("overflow-y-hidden");
		await new Promise((res) => {
			gsap.effects.rollIn([logo, attrib], { onComplete: res });
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
		);
		fadeTL.fadeOut(
			mask,
			{
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
			<div class="fixed z-[calc(infinity)] h-screen w-full">
				<div
					class="bg-p-dark dark:bg-p-light pointer-events-none absolute -z-10 h-full w-full"
					ref={mask}
				></div>
				<div
					class="bg-p-light dark:bg-p-dark flex h-full w-full flex-col items-center justify-center perspective-normal"
					ref={screen}
				>
					<Logo
						class="text-p-dark dark:text-p-light -mt-16 w-1/3 origin-[center_top] transform-3d sm:w-1/5"
						ref={logo}
					></Logo>
					<span
						class="text-p-dark font-p dark:text-p-light py-5 text-xl font-medium sm:text-2xl"
						ref={attrib}
					>
						Presented by CarbonicSoda
					</span>
				</div>
			</div>
		</Show>
	);
};
