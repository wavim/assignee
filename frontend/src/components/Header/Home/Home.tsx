import { A } from "@solidjs/router";

import { useI18n } from "../I18n";

import Logo from "../../Logo/Logo";

export default (props: { ref: HTMLAnchorElement }) => {
	const [t] = useI18n();

	return (
		<A
			ref={props.ref}
			href="/home"
			aria-label={t("home.label")}
			class="h-1/2"
		>
			<Logo class="text-text-primary h-full"></Logo>
		</A>
	);
};
