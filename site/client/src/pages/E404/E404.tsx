import { A } from "@solidjs/router";
import Button1 from "../../gui/Button1";
import Footer from "../Footer";
import Header from "../Header";
import Main from "../Main";
import Section from "../Section";
import I18n from "./I18n";

export default () => (
	<I18n.I18n>
		<Header></Header>
		<Main>
			<Info></Info>
		</Main>
		<Footer></Footer>
	</I18n.I18n>
);

const Info = () => {
	const t = I18n.useI18n();

	return (
		<Section
			head="404"
			deck={t("deck")}
		>
			<A href="/">
				<Button1 pill>{t("back")}</Button1>
			</A>
		</Section>
	);
};
