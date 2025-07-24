import { useNavigate } from "@solidjs/router";
import Button from "../../atoms/Button";
import I18n from "./I18n";

export default () => {
	const t = I18n.useI18n();

	const nav = useNavigate();

	return (
		<section class="bg-main flex flex-col gap-7 px-7">
			<h1 class="font-jakarta text-text-major text-6xl font-bold">404</h1>
			<p class="font-jakarta text-text-minor text-xl">{t("info.detail")}</p>
			<Button
				onclick={() => {
					nav("/", { replace: true });
				}}
			>
				{t("info.action")}
			</Button>
		</section>
	);
};
