import { createSignal, onMount } from "solid-js";
import Icon from "../../../../components/Icon/Icon";
import gsap from "gsap";
import { Locomotive } from "../../../../libs";

export default () => {
	let frame!: HTMLDivElement;

	const [iconStyles, setIconStyles] = createSignal("none");

	onMount(() => {
		//MO TODO check if it is solid-router's fault
		const scroll = new Locomotive({
			el: document.querySelector("[data-scroll-container]") as HTMLElement,
			smooth: true,
			multiplier: 1,
			class: "is-inview",
		});
	});

	window.addEventListener("pageReveal", () => {
		gsap.effects.rollIn(frame, { delay: 0.3 });

		const updateIcon = (ev: MouseEvent) => {
			ev.stopPropagation();

			const offsetX = (100 * ev.clientX) / window.innerWidth - 50;
			const offsetY = (100 * ev.clientY) / window.innerHeight - 50;
			requestAnimationFrame(() => {
				setIconStyles(
					`transform: translate(${offsetX * 0.8}%, ${offsetY * 0.6}%)`,
				);
			});
		};
		window.addEventListener("mousemove", updateIcon);
		//MO TODO use intersection observer instead
	});

	return (
		<div class="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center perspective-normal">
			<div
				ref={frame}
				class="bg-s-light cp-polygon-[10%_0,_100%_0%,_90%_100%,_0%_100%] flex h-full w-1/4 origin-[center_top] transform-3d"
				data-scroll
				data-scroll-speed="-1"
			>
				<Icon
					class="origin-center transition duration-1000 ease-out"
					style={iconStyles()}
				></Icon>
			</div>
		</div>
	);
};
