import { createSignal } from "solid-js";
import Icon from "../../../../components/Icon/Icon";
import gsap from "gsap";
import { isInView } from "../../../../utils/view";

export default () => {
	let frame!: HTMLDivElement;

	const [iconStyles, setIconStyles] = createSignal("none");

	window.addEventListener("pageReveal", () => {
		gsap.effects.rollIn(frame, { delay: 0.3 });

		let fListen = true;
		const updateIcon = (ev: MouseEvent) => {
			ev.stopPropagation();

			const offsetX = (100 * ev.clientX) / window.innerWidth - 50;
			const offsetY = (100 * ev.clientY) / window.innerHeight - 50;
			requestAnimationFrame(() => {
				setIconStyles(
					`transform: translate(${offsetX * 0.8}%, ${offsetY * 0.6}%)`,
				);
			});
			// console.log("YO");
		};
		window.addEventListener("mousemove", updateIcon);
		//MO TODO check loco is-inview thing
		// window.addEventListener("scroll", () => {
		// 	const inView = isInView(frame);
		// 	if (fListen && !inView) {
		// 		fListen = false;
		// 		window.removeEventListener("mousemove", updateIcon);
		// 		return;
		// 	}
		// 	if (!fListen && inView) {
		// 		fListen = true;
		// 		window.addEventListener("mousemove", updateIcon);
		// 	}
		// });
	});

	return (
		<div
			class="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center perspective-normal"
			data-scroll-section
		>
			<div
				ref={frame}
				class="bg-s-light cp-polygon-[10%_0,_100%_0%,_90%_100%,_0%_100%] flex h-full w-1/4 origin-[center_top] transform-3d"
				data-scroll
				data-scroll-speed="3"
			>
				<Icon
					class="origin-center transition duration-1000 ease-out"
					style={iconStyles()}
				></Icon>
			</div>
		</div>
	);
};
