import { gsap } from "gsap";
import { onMount } from "solid-js";
import Button from "../../../components/Button/Button";
import Split from "../../../components/utils/Split";
import { effects } from "../../../effects/effects";
import { reveal } from "../../../utils/reveal";

export default () => {
	let motos!: HTMLDivElement;
	let moto1!: HTMLDivElement;
	let moto2!: HTMLDivElement;
	let loginButtonParent!: HTMLDivElement;
	let loginButtonChild!: HTMLButtonElement;

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
			)
			.add(effects.scanin.parent(loginButtonParent), "<")
			.add(effects.scanin.child(loginButtonChild), "<");
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
					<Split>Streamline the Process</Split>
				</div>
				<div
					ref={moto2}
					class="origin-[center_top] transform-3d"
				>
					<Split>Assignments Made Easy</Split>
				</div>
			</div>
			<div
				ref={loginButtonParent}
				class="ml-20"
			>
				<Button ref={loginButtonChild}>Login/Signup</Button>
			</div>
		</section>
	);
};
