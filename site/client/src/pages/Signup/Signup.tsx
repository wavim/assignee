import Footer from "../../gui/Footer/Footer";
import Guest from "../../gui/Guest";
import Header from "../../gui/Header/Header";
import Main from "../../gui/Main";
import I18n from "./I18n";

export default () => {
	return (
		<Guest>
			<I18n.I18n>
				<Header></Header>
				<Main>Hi</Main>
				<Footer></Footer>
			</I18n.I18n>
		</Guest>
	);
};
