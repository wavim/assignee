import Header from "../../components/Header/Header";
import Hero from "./Hero/Hero";

export default () => {
	//MO DEV height for scroll
	return (
		<>
			<Header></Header>
			<main class="bg-main-bg flex h-[1000vh] w-full flex-col">
				<Hero></Hero>
				<button
					onclick={() => document.documentElement.classList.toggle("dark")}
					class="mt-10 h-20 w-full bg-amber-400"
				>
					DevToggle
				</button>
			</main>
		</>
	);
};
