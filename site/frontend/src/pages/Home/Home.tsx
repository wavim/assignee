import Header from "../../components/Header/Header";
import Hero from "./Hero/Hero";

export default () => {
	//MO DEV height for scroll
	return (
		<>
			<Header></Header>
			<main class="bg-p-light flex h-[1000vh] w-full flex-col">
				<Hero></Hero>
			</main>
		</>
	);
};
