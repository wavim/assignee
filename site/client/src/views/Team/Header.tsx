import { A } from "@solidjs/router";
import Header from "../Header";
import I18n from "./I18n";

export default () => (
	<Header>
		<A
			href="/dash"
			class="font-jakarta text-text-major text-lg"
		>
			{I18n.useI18n()("dash")} ›
		</A>
	</Header>
);
