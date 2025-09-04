import { A } from "@solidjs/router";
import Header from "../Header";
import I18n from "./I18n";

export default (props: { tid: string }) => (
	<Header>
		<A
			href={`/team/${props.tid}`}
			class="font-jakarta text-text-major text-lg"
		>
			{I18n.useI18n()("team")} ›
		</A>
	</Header>
);
