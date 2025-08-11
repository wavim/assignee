import { A } from "@solidjs/router";
import Button from "../../gui/Button";
import Footer from "../Footer";
import Header from "../Header";
import Main from "../Main";
import Section from "../Section";
import Tile from "../Tile";
import I18n from "./I18n";

export default () => (
	<I18n.I18n>
		<Header></Header>
		<Main>
			<Hero></Hero>
			<Tile></Tile>
			<Feat></Feat>
			<CtoA></CtoA>
		</Main>
		<Footer></Footer>
	</I18n.I18n>
);

const Hero = () => {
	const t = I18n.useI18n();

	return (
		<Section
			head={t("hero.head")}
			deck={t("hero.deck")}
		>
			<A href="/signin">
				<Button pill>{t("hero.ctoa")}</Button>
			</A>
		</Section>
	);
};

const Feat = () => {
	const t = I18n.useI18n();

	const Item = (props: { name: string; children: string }) => (
		<div class="flex flex-col md:flex-row">
			<h2 class="text-text-major mb-4 flex-1 text-3xl md:text-4xl">{props.name}</h2>
			<p class="text-text-major text-xl md:w-2/3 md:text-2xl md:hyphens-auto">{props.children}</p>
		</div>
	);
	const Line = () => <div class="border-border my-6 border-1 md:mt-10"></div>;

	return (
		<section class="font-jakarta px-8 md:px-16">
			<h1 class="text-text-major mb-12 text-center text-5xl font-medium md:my-28 md:text-7xl">
				{t("feat.head")}
			</h1>
			<div class="md:flex">
				<h1 class="font-jakarta text-text-minor sticky top-32 mb-14 hidden flex-1 self-start text-4xl md:block">
					{t("feat.feat")}
				</h1>
				<div class="md:w-2/3">
					<Item name={t("feat.groups.name")}>{t("feat.groups.desc")}</Item>
					<Line></Line>
					<Item name={t("feat.assign.name")}>{t("feat.assign.desc")}</Item>
					<Line></Line>
					<Item name={t("feat.submit.name")}>{t("feat.submit.desc")}</Item>
					<Line></Line>
					<Item name={t("feat.return.name")}>{t("feat.return.desc")}</Item>
				</div>
			</div>
		</section>
	);
};

const CtoA = () => {
	const t = I18n.useI18n();

	return (
		<Section
			head={t("ctoa.head")}
			deck={t("ctoa.deck")}
		>
			<A href="/signin">
				<Button pill>{t("ctoa.ctoa")}</Button>
			</A>
		</Section>
	);
};
