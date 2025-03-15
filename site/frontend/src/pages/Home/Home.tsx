import { gsap } from "gsap";

export default () => {
	//MO TODO use break text or smthin to streamline
	let hello!: HTMLParagraphElement;
	let world!: HTMLParagraphElement;

	window.addEventListener("pageReveal", () => {
		gsap.fromTo(
			[hello, world],
			{ opacity: 0, translateY: "100%", filter: "blur(0.6rem)" },
			{
				opacity: 1,
				translateY: 0,
				filter: "blur(0rem)",
				duration: 1.6,
				ease: "circ.out",
				delay: 0.6,
				stagger: 0.06,
			},
		);
	});

	return (
		<>
			<main class="bg-primary-bg h-[200vh] min-h-screen w-full">
				<span
					class="font-montserrat mt-96 ml-10 inline-block text-7xl"
					ref={hello}
				>
					Hello
				</span>
				<span
					class="font-montserrat mt-96 ml-10 inline-block text-7xl"
					ref={world}
				>
					World!
				</span>
			</main>
		</>
	);
};
