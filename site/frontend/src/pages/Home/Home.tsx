import { onMount } from "solid-js";

import Hero from "./Hero/Hero";

export default () => {
	//MO TODO use lenis + gsap, maybe with a wrapper component

	//MO TEST remove height later
	return (
		<>
			<main class="bg-p-light dark:bg-p-dark flex h-[1000vh] min-h-screen w-full flex-col">
				<Hero></Hero>
			</main>
		</>
	);
};
