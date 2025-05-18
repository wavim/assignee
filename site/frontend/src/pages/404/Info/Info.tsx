import { useI18n } from "../I18n";

import Button from "../../../components/Button/Button";

export default () => {
	const [t] = useI18n();

	return (
		<section class="bg-main flex flex-col gap-7 px-7">
			<h1 class="font-jakarta text-text-primary w-4/5 text-6xl font-bold">
				404
			</h1>
			<p class="font-jakarta text-text-secondary w-full text-xl">
				{t("info.detail")}
			</p>
			<Button onclick={() => history.back()}>{t("info.action")}</Button>
		</section>
	);
};
