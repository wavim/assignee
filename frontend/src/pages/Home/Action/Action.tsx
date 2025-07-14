import { useI18n } from "../I18n";

import ButtonA from "../../../components/ButtonA/ButtonA";

export default () => {
	const [t] = useI18n();

	return (
		<section class="bg-main flex flex-col gap-7 px-7">
			<h1 class="font-jakarta text-text-primary w-4/5 text-4xl font-bold">
				{t("action.header")}
			</h1>
			<p class="font-jakarta text-text-secondary text-xl">
				{t("action.subtitle")}
			</p>
			<ButtonA href="/signup">{t("action.prompt")}</ButtonA>
		</section>
	);
};
