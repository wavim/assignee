import { gsap } from "gsap";
import { onMount } from "solid-js";

import SplitWords from "../../../components/utils/SplitWords";
import { effects } from "../../../effects/effects";
import { reveal } from "../../../utils/reveal";
import Login from "./Login/Login";

export default () => {
	let motos!: HTMLDivElement;
	let moto1!: HTMLDivElement;
	let moto2!: HTMLDivElement;
	let loginParent!: HTMLDivElement;
	let loginChild!: HTMLButtonElement;

	onMount(async () => {
		await reveal();

		const tl = gsap.timeline();

		tl.add(
			effects.rollin([...moto1.children, ...moto2.children], { delay: 0.5 }),
		)
			.fromTo(
				motos,
				{ marginBottom: 0 },
				{
					marginBottom: "10vh",

					duration: 1.2,
					ease: "power4.out",
				},
				">-0.6",
			)
			.add(effects.scanin.parent(loginParent), "<")
			.add(effects.scanin.child(loginChild), "<");
	});

	return (
		<section class="flex min-h-screen flex-col justify-center">
			<div
				ref={motos}
				class="text-p-dark font-p ml-16 flex w-max flex-col text-9xl perspective-normal"
			>
				<div
					ref={moto1}
					class="origin-[center_top] transform-3d"
				>
					<SplitWords>Streamline the Process</SplitWords>
				</div>
				<div
					ref={moto2}
					class="origin-[center_top] transform-3d"
				>
					<SplitWords>Assignments Made Easy</SplitWords>
				</div>
			</div>
			<div
				ref={loginParent}
				class="ml-20"
			>
				<Login ref={loginChild}></Login>
			</div>
		</section>
	);
};
