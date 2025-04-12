import gsap from "gsap";
import { onMount } from "solid-js";
import { atoms } from "../../effects/atoms";

export default () => {
	let header!: HTMLDivElement;

	onMount(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				start: window.innerHeight * 0.25,
				onLeaveBack: () => tl.reverse(),
			},
		});

		tl.add(atoms.fadein(header, { duration: 0.5 })).fromTo(
			header,
			{ scaleX: 1.02, scaleY: 1.2 },
			{
				scaleX: 1,
				scaleY: 1,

				duration: 0.5,
				ease: "power3.out",
			},
			"<",
		);
	});

	return (
		<header
			ref={header}
			class="bg-s-light/60 z-top fixed mt-5 h-24 w-[97vw] self-center rounded-2xl opacity-0 backdrop-blur-xl"
		></header>
	);
};
