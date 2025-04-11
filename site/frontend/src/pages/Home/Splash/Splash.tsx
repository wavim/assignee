import { gsap } from "gsap";
import { onMount } from "solid-js";
import { effects } from "../../../effects/effects";
import { reveal } from "../../../utils/reveal";

export default () => {
	let moto1!: HTMLDivElement;
	let moto2!: HTMLDivElement;

	onMount(async () => {
		await reveal();

		const tl = gsap.timeline();

		tl.add(effects.rollin([moto1, moto2], { delay: 0.5 }));
	});

	return (
		<section class="flex flex-col justify-center align-middle">
			<div class="text-p-dark font-p flex flex-col pl-16 text-9xl perspective-normal">
				<div
					ref={moto1}
					class="origin-[center_top] transform-3d"
				>
					Streamline the Process
				</div>
				<div
					ref={moto2}
					class="origin-[center_top] transform-3d"
				>
					Assignments Made Easy
				</div>
			</div>
			{/* <div class="text-p-dark font-p pl-20 text-3xl">Login/Signup</div> */}
		</section>
	);
};
