import { gsap } from "gsap";
import { createSignal, onMount, Show } from "solid-js";
import { atoms } from "../../effects/atoms";
import { effects } from "../../effects/effects";
import Logo from "../Logo/Logo";

export default (props: { pageLoad: Promise<void> }) => {
	if (sessionStorage.getItem("debut") === "false") return <></>;

	let screen!: HTMLDivElement;
	let mask!: HTMLDivElement;
	let logo!: SVGSVGElement;
	let attrib!: HTMLSpanElement;

	const [isLoading, setIsLoading] = createSignal(true);

	onMount(async () => {
		document.body.classList.add("overflow-y-hidden");

		await new Promise((res) => {
			const tl = gsap.timeline();

			tl.add(effects.rollin([logo, attrib], { onComplete: res }));
		});

		await props.pageLoad;
		window.dispatchEvent(new CustomEvent(":reveal"));

		const tl = gsap.timeline({
			onComplete: () => {
				setIsLoading(false);
				document.body.classList.remove("overflow-y-hidden");

				sessionStorage.setItem("debut", "false");
			},
		});

		tl.add(
			gsap.fromTo(
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
			),
		).add(atoms.fadeout(mask, { duration: 1.2, ease: "expo.inOut" }), "<");
	});

	return (
		<Show when={isLoading()}>
			<div class="fixed z-[calc(infinity)] h-screen w-full">
				<div
					ref={mask}
					class="bg-p-dark pointer-events-none absolute -z-10 h-full w-full"
				></div>
				<div
					ref={screen}
					class="bg-p-light flex h-full w-full flex-col items-center justify-center perspective-normal"
				>
					<Logo
						ref={logo}
						class="text-p-dark -mt-16 w-1/5 origin-[center_top] transform-3d"
					></Logo>
					<span
						ref={attrib}
						class="text-p-dark font-p py-5 text-xl font-medium"
					>
						Presented by David W
					</span>
				</div>
			</div>
		</Show>
	);
};
