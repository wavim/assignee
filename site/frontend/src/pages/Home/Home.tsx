import Header from "../../components/Header/Header";
import Context, { useI18n } from "./Context";
import Hero from "./Hero/Hero";

export default () => {
	//MO DEV height for scroll
	return (
		<Context>
			<Header></Header>
			<main class="flex h-[1000vh] w-full flex-col">
				<Hero></Hero>
			</main>
		</Context>
	);
};
