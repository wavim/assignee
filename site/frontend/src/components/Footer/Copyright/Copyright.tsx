import { useI18n } from "../I18n";

export default () => {
	const [t] = useI18n();

	return (
		<p class="font-jakarta text-text-secondary text-lg">{t("copyright")}</p>
	);
};
