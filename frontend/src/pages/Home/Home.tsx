import Link from "../../atoms/Link";
import Tiles from "../../atoms/Tiles";
import Footer from "../../layouts/Footer/Footer";
import Header from "../../layouts/Header/Header";
import I18n from "./I18n";

export default () => (
	<I18n.I18n>
		<Header></Header>
		<main class="flex w-full flex-1 flex-col gap-16 md:gap-24">
			<Hero></Hero>
			<Tiles></Tiles>
			<Feature></Feature>
			<Action></Action>
		</main>
		<Footer></Footer>
	</I18n.I18n>
);

const Hero = () => {
	const t = I18n.useI18n();

	return (
		<section class="font-jakarta flex flex-col gap-8 px-8 md:items-center md:gap-12">
			<h1 class="text-text-major w-4/5 text-4xl font-medium md:text-center md:text-5xl">
				{t("hero.title")}
			</h1>
			<p class="text-text-minor w-11/12 text-xl md:text-center md:text-2xl">
				{t("hero.subtitle")}
			</p>
			<Link href="/login">{t("hero.login")}</Link>
		</section>
	);
};

const Feature = () => {
	const t = I18n.useI18n();

	const Item = (props: { title: string; children: string }) => (
		<div class="flex flex-col md:flex-row">
			<h2 class="text-text-major mb-4 flex-1 text-3xl md:text-4xl">
				{props.title}
			</h2>
			<p class="text-text-major text-xl md:w-3/5 md:text-2xl">{props.children}</p>
		</div>
	);

	const Line = () => <div class="border-text-minor my-6 border-1 md:mt-10"></div>;

	return (
		<section class="font-jakarta px-8">
			<h1 class="text-text-major mb-12 text-center text-5xl font-medium md:mb-16 md:text-6xl">
				{t("features.title")}
			</h1>
			<Item title={t("features.groups.title")}>
				{t("features.groups.detail")}
			</Item>
			<Line></Line>
			<Item title={t("features.assign.title")}>
				{t("features.assign.detail")}
			</Item>
			<Line></Line>
			<Item title={t("features.submit.title")}>
				{t("features.submit.detail")}
			</Item>
			<Line></Line>
			<Item title={t("features.return.title")}>
				{t("features.return.detail")}
			</Item>
		</section>
	);
};

const Action = () => {
	const t = I18n.useI18n();

	return (
		<section class="font-jakarta flex flex-col gap-8 px-8 md:items-center md:gap-12">
			<h1 class="text-text-major w-4/5 text-4xl font-medium md:text-center md:text-5xl">
				{t("action.title")}
			</h1>
			<p class="text-text-minor w-11/12 text-xl md:text-center md:text-2xl">
				{t("action.subtitle")}
			</p>
			<Link href="/login">{t("action.login")}</Link>
		</section>
	);
};
