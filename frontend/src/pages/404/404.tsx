import Link from "../../atoms/Link";
import Part from "../../atoms/Part";
import Footer from "../../layouts/Footer/Footer";
import Header from "../../layouts/Header/Header";
import I18n from "./I18n";

export default () => {
	return (
		<I18n.I18n>
			<Header></Header>
			<main class="w-full flex-1">
				<Info></Info>
			</main>
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
