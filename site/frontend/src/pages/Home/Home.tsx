import Header from "../../components/Header/Header";
import Hero from "./Hero/Hero";
import I18n from "./I18n";
import Quote from "./Quote/Quote";

export default () => {
	//MO DEV height for scroll
	return (
		<I18n>
			<Header></Header>
			<main class="flex h-[1000vh] w-full flex-col gap-8">
				<Hero></Hero>
				<Quote></Quote>
			</main>
		</I18n>
	);
};
