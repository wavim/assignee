import { A } from "@solidjs/router";

import { useI18n } from "../I18n";

import Logo from "../../Logo/Logo";

export default () => {
	const [t] = useI18n();

	return (
		<A
			href="/home"
			aria-label={t("homenav.label")}
			class="block w-1/2"
		>
			<Logo class="text-text-primary w-full"></Logo>
		</A>
	);
};
