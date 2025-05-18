import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import I18n from "./I18n";
import Info from "./Info/Info";

export default () => {
	return (
		<I18n>
			<Header></Header>
			<main class="flex w-full flex-[1] flex-col gap-16">
				<Info></Info>
			</main>
			<Footer></Footer>
		</I18n>
	);
};
