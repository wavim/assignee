import { onMount } from "solid-js";
import { Locomotive } from "../../libs";

import Hero from "./Hero/Hero";

export default () => {

	//MO TEST remove height later
	return (
		<>
			<main
				class="bg-p-light dark:bg-p-dark flex h-[1000vh] min-h-screen w-full flex-col"
				data-scroll-container
			>
				<Hero></Hero>
			</main>
		</>
	);
};
