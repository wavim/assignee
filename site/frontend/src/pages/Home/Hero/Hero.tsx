import { useI18n } from "../I18n";

import Login from "./Login/Login";

export default () => {
	const [t] = useI18n();

	return (
		<section class="bg-main flex justify-around">
			<div class="flex w-full flex-col gap-7 px-7">
				<h1 class="font-jakarta text-text-primary w-4/5 text-4xl font-bold">
					{t("hero.header")}
				</h1>
				<p class="font-jakarta text-text-secondary w-full text-xl">
					{t("hero.subtitle")}
				</p>
				<Login></Login>
			</div>
		</section>
	);
};
