import Footer from "../../gui/Footer/Footer";
import Header from "../../gui/Header/Header";
import Link from "../../gui/Link";
import Main from "../../gui/Main";
import Part from "../../gui/Part";
import I18n from "./I18n";

export default () => {
	return (
		<I18n.I18n>
			<Header></Header>
			<Main>
				<Info></Info>
			</Main>
			<Footer></Footer>
		</I18n.I18n>
	);
};

const Info = () => {
	const t = I18n.useI18n();

	return (
		<Part
			title="404"
			subtitle={t("detail")}
		>
			<Link href="/">{t("link")}</Link>
		</Part>
	);
};
