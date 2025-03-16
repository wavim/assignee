import { gsap } from "gsap";

export default () => {
	//MO TODO use break text or smthin to streamline
	let hello!: HTMLParagraphElement;
	let world!: HTMLParagraphElement;

	window.addEventListener("pageReveal", () => {
		gsap.effects.blurIn([hello, world]);
	});

	return (
		<>
			<main class="bg-p-light dark:bg-p-dark h-[200vh] min-h-screen w-full">
				<span
					class="font-primary text-p-dark dark:text-p-light mt-96 ml-10 inline-block text-7xl"
					ref={hello}
				>
					Hello
				</span>
				<span
					class="font-primary text-p-dark dark:text-p-light mt-96 ml-10 inline-block text-7xl"
					ref={world}
				>
					World!
				</span>
			</main>
		</>
	);
};
