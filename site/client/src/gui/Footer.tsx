import { defineI18n } from "./I18n";
import Logo from "./Logo";

const I18n = defineI18n({
	en: { C: "Copyright © 2025 David W" },
	zh: { C: "版權所有 © 2025 David W" },
});

export default () => (
	<I18n.I18n>
		<footer class="bg-main mt-12 flex w-full flex-col gap-2 p-8 md:mt-4">
			<Logo class="fill-text-major h-4"></Logo>
			<Copyright></Copyright>
		</footer>
	</I18n.I18n>
);

const Copyright = () => (
	<a
		target="_blank"
		href="https://github.com/wavim"
		class="font-jakarta text-text-minor text-lg md:text-sm"
	>
		{I18n.useI18n()("C")}
	</a>
);
