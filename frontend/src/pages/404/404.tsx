import Link from "../../atoms/Link";
import Footer from "../../layouts/Footer/Footer";
import Header from "../../layouts/Header/Header";
import I18n from "./I18n";

export default () => {
	return (
		<I18n.I18n>
			<Header></Header>
			<main class="w-full">
				<Info></Info>
			</main>
			<Footer></Footer>
		</I18n.I18n>
	);
};

const Info = () => {
	const t = I18n.useI18n();

	return (
		<section class="font-jakarta bg-main flex flex-col gap-8 px-8">
			<h1 class="text-text-major text-6xl font-medium">404</h1>
			<p class="text-text-minor text-xl">{t("detail")}</p>
			<Link href="/">{t("link")}</Link>
		</section>
	);
};
