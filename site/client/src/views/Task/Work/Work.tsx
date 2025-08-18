import { GetTaskResults } from "@app/schema";
import { Match, Setter, Switch } from "solid-js";
import AuthView from "./AuthView";
import MembView from "./MembView";

export default (props: { detail: GetTaskResults; mutate: Setter<GetTaskResults> }) => (
	<Switch>
		<Match when={props.detail.auth}>
			<AuthView detail={props.detail as Extract<GetTaskResults, { auth: true }>}></AuthView>
		</Match>
		<Match when={!props.detail.auth}>
			<MembView
				detail={props.detail as Extract<GetTaskResults, { auth: false }>}
				mutate={props.mutate}
			></MembView>
		</Match>
	</Switch>
);
