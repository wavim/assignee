import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import I18n from "./I18n";
import Info from "./Info/Info";

export default () => {
	return (
		<I18n>
			<Header></Header>
			<main class="w-full flex-[1]">
				<Info></Info>
			</main>
			<Footer></Footer>
		</I18n>
	);
};
