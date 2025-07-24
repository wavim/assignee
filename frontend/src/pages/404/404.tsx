import Footer from "../../layouts/Footer/Footer";
import Header from "../../layouts/Header/Header";
import I18n from "./I18n";
import Info from "./Info";

export default () => {
	return (
		<I18n.I18n>
			<Header></Header>
			<main class="w-full flex-[1]">
				<Info></Info>
			</main>
			<Footer></Footer>
		</I18n.I18n>
	);
};
