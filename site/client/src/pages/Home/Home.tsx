import Footer from "../../gui/Footer/Footer";
import Header from "../../gui/Header/Header";
import Link from "../../gui/Link";
import Main from "../../gui/Main";
import Part from "../../gui/Part";
import Tiles from "../../gui/Tiles";
import I18n from "./I18n";

export default () => (
	<I18n.I18n>
		<Header></Header>
		<Main>
			<Hero></Hero>
			<Tiles></Tiles>
			<Feature></Feature>
			<Action></Action>
		</Main>
		<Footer></Footer>
	</I18n.I18n>
);

const Hero = () => {
	const t = I18n.useI18n();

	return (
		<Part
			title={t("hero.title")}
			subtitle={t("hero.subtitle")}
		>
			<Link href="/signin">{t("hero.signin")}</Link>
		</Part>
	);
};

const Feature = () => {
	const t = I18n.useI18n();

	const Item = (props: { title: string; children: string }) => (
		<div class="flex flex-col md:flex-row">
			<h2 class="text-text-major mb-4 flex-1 text-3xl md:text-4xl">
				{props.title}
			</h2>
			<p class="text-text-major text-xl md:w-2/3 md:text-2xl">{props.children}</p>
		</div>
	);

	const Line = () => <div class="border-text-minor my-6 border-1 md:mt-10"></div>;

	return (
		<section class="font-jakarta px-8">
			<h1 class="text-text-major mb-12 text-center text-5xl font-medium md:mb-16 md:text-7xl">
				{t("features.title")}
			</h1>
			<div class="md:flex">
				<h1 class="font-jakarta text-text-minor sticky top-28 mb-28 hidden h-3/4 flex-1 self-start text-5xl md:block">
					{t("features.alias")}
				</h1>
				<div class="md:w-2/3">
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
				</div>
			</div>
		</section>
	);
};

const Action = () => {
	const t = I18n.useI18n();

	return (
		<Part
			title={t("action.title")}
			subtitle={t("action.subtitle")}
		>
			<Link href="/signin">{t("hero.signin")}</Link>
		</Part>
	);
};
