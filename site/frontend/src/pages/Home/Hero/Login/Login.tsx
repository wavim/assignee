import { useI18n } from "../../I18n";

import Button from "../../../../components/Button/Button";

//MO TODO decide if login/signup will be in another page or in home
export default () => {
	const [t] = useI18n();

	return (
		<div class="flex items-center">
			<Button onclick={() => void 0}>{t("hero.login.prompt")}</Button>
		</div>
	);
};
