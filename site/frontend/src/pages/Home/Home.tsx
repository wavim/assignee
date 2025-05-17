import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Features from "./Features/Features";
import Hero from "./Hero/Hero";
import I18n from "./I18n";
import Quote from "./Quote/Quote";

export default () => {
	return (
		<I18n>
			<Header></Header>
			<main class="flex w-full flex-[1] flex-col gap-12">
				<Hero></Hero>
				<Quote></Quote>
				<Features></Features>
			</main>
			<Footer></Footer>
		</I18n>
	);
};
