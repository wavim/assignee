import { For } from "solid-js";

import Wrap from "./Wrap";

const SplitAll = (props: { class?: string; children: string }) => {
	return (
		<For each={props.children.split(" ")}>
			{(word) => (
				<Split
					type="char"
					class={props.class}
				>
					{word + "\u00a0"}
				</Split>
			)}
		</For>
	);
};

const Split = (props: {
	type: "char" | "word" | "all";
	class?: string;
	children: string;
}) => {
	return props.type === "all" ? (
		<SplitAll class={props.class}>{props.children}</SplitAll>
	) : (
		<For each={props.children.split(props.type === "char" ? "" : " ")}>
			{(segment) => (
				<Wrap
					pclass={props.class}
					class="inline-block"
				>
					{segment + (props.type === "char" ? "" : "\u00a0")}
				</Wrap>
			)}
		</For>
	);
};

export default Split;
