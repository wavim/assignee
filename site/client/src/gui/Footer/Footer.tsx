import Logo from "../Logo";
import I18n from "./I18n";

export default () => {
	return (
		<I18n.I18n>
			<footer class="bg-main mt-12 flex w-full flex-col gap-2 p-8 md:mt-18">
				<Logo class="fill-text-major h-8 md:h-4"></Logo>
				<Copyright></Copyright>
			</footer>
		</I18n.I18n>
	);
};

const Copyright = () => {
	const t = I18n.useI18n();

	return <p class="font-jakarta text-text-minor text-lg md:text-sm">{t("copyright")}</p>;
};
