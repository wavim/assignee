import { Props } from "../types/props";
import { defineI18n } from "./I18n";
import Logo from "./Logo";

const I18n = defineI18n({
	en: { C: "Copyright © 2025 David Wu" },
	zh: { C: "版權所有 © 2025 David Wu" },
});

export default (props: Props<"footer">) => (
	<I18n.I18n>
		<div class="flex-1"></div>
		<footer {...props}>
			<Logo class="fill-text-major h-4"></Logo>
			<a
				target="_blank"
				href="https://github.com/wavim"
				class="font-jakarta text-text-minor w-max text-lg md:text-sm"
			>
				{I18n.useI18n()("C")}
			</a>
		</footer>
	</I18n.I18n>
);
