import I18n from "../I18n";

import ButtonA from "../../../atoms/ButtonA";

export default () => {
	const t = I18n.useI18n();

	return (
		<section class="bg-main flex flex-col gap-7 px-7">
			<h1 class="font-jakarta text-text-major w-4/5 text-4xl font-bold">
				{t("action.header")}
			</h1>
			<p class="font-jakarta text-text-minor text-xl">{t("action.subtitle")}</p>
			<ButtonA href="/signup">{t("action.prompt")}</ButtonA>
		</section>
	);
};
