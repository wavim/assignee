import { defineI18n } from "./I18n";
import Logo from "./Logo";

const I18n = defineI18n({
	en: { C: "Copyright © 2025 David W" },
	zh: { C: "版權所有 © 2025 David W" },
});

export default () => (
	<I18n.I18n>
		<Logo class="fill-text-major h-4"></Logo>
		<a
			target="_blank"
			href="https://github.com/wavim"
			class="font-jakarta text-text-minor text-lg md:text-sm"
		>
			{I18n.useI18n()("C")}
		</a>
	</I18n.I18n>
);
