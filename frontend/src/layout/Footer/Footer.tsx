import Logo from "../../ui/Logo";
import I18n from "./I18n";

export default () => {
	return (
		<I18n.I18n>
			<footer class="bg-main mt-12 flex w-full flex-col gap-2 p-7">
				<Logo class="fill-text-primary h-8"></Logo>
				<Copyright></Copyright>
			</footer>
		</I18n.I18n>
	);
};

const Copyright = () => {
	const t = I18n.useI18n();

	return <p class="font-jakarta text-text-secondary text-lg">{t("copyright")}</p>;
};
