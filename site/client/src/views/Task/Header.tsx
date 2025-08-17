import { A } from "@solidjs/router";
import { defineI18n } from "../../gui/I18n";
import Header from "../Header";

const I18n = defineI18n({ en: { team: "Back Team" }, zh: { team: "返回群組" } });

export default (props: { tid: string }) => (
	<I18n.I18n>
		<Header>
			<A
				href={`/team/${props.tid}`}
				class="font-jakarta text-text-major text-lg"
			>
				{I18n.useI18n()("team")} ›
			</A>
		</Header>
	</I18n.I18n>
);
