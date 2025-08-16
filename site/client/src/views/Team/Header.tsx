import { A } from "@solidjs/router";
import { defineI18n } from "../../gui/I18n";
import Header from "../Header";

const I18n = defineI18n({ en: { dash: "Dashboard" }, zh: { dash: "返回主頁" } });

export default () => (
	<I18n.I18n>
		<Header>
			<A
				href="/dash"
				class="font-jakarta text-text-major text-lg"
			>
				{`${I18n.useI18n()("dash")} ›`}
			</A>
		</Header>
	</I18n.I18n>
);
