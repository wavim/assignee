import { JSXElement } from "solid-js";
import { useI18n } from "../I18n";

export default () => {
	const [t] = useI18n();

	return (
		<section class="bg-main px-7">
			{/* for pc version <h1 class="font-jakarta sticky top-20 block text-3xl">Features</h1> */}
			<Feature title={t("features.groups.title")}>
				{t("features.groups.detail")}
			</Feature>
			<Separator></Separator>
			<Feature title={t("features.assign.title")}>
				{t("features.assign.detail")}
			</Feature>
			<Separator></Separator>
			<Feature title={t("features.submit.title")}>
				{t("features.submit.detail")}
			</Feature>
			<Separator></Separator>
			<Feature title={t("features.return.title")}>
				{t("features.return.detail")}
			</Feature>
		</section>
	);
};

const Feature = (props: { title: string; children: JSXElement }) => (
	<div>
		<h1 class="font-jakarta text-text-primary mb-4 text-3xl">{`${props.title}.`}</h1>
		<p class="font-jakarta text-text-primary max-w-[95%] text-xl">
			{props.children}
		</p>
	</div>
);

const Separator = () => (
	<div class="border-text-secondary my-6 h-0 w-full border-1"></div>
);
