import { Show } from "solid-js";
import Header from "../../components/Header/Header";
import Hero from "./Hero/Hero";

export default () => {
	//MO DEV height for scroll
	return (
		<>
			<Header></Header>
			<main class="bg-main-bg flex h-[1000vh] w-full flex-col">
				<Hero></Hero>
				<Show when={import.meta.env.DEV}>
					<button
						onclick={() => {
							const isDark = document.documentElement.classList.toggle("dark");
							localStorage.setItem("scheme", isDark ? "dark" : "light");
						}}
						class="mt-10 h-20 w-full bg-amber-400"
					>
						DEV (Toggle Dark Mode) DEV
					</button>
				</Show>
			</main>
		</>
	);
};
