import { onMount } from "solid-js";
import { Locomotive } from "../../libs";

import Hero from "./Hero/Hero";

export default () => {
	window.addEventListener("pageReveal", () => {});

	onMount(() => {
		const locomotive = new Locomotive({
			el: document.querySelector("main")!,
			smooth: true,
		});
	});

	//MO TEST remove height later
	return (
		<>
			<main class="bg-p-light dark:bg-p-dark flex h-[1000vh] min-h-screen w-full flex-col">
				<Hero></Hero>
			</main>
		</>
	);
};
