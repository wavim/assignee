import { A } from "@solidjs/router";

import { useI18n } from "../../I18n";

import Button from "../../../../components/Button/Button";

export default () => {
	const [t] = useI18n();

	return (
		<A href="/login">
			<Button>{t("hero.login.prompt")}</Button>
		</A>
	);
};
