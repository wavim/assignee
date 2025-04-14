import { For } from "solid-js";

export default (props: { children: string; class?: string }) => {
	return (
		<>
			<For each={props.children.split("")}>
				{(char) => (
					<div class={`inline-block ${props.class ?? ""}`}>{char}</div>
				)}
			</For>
		</>
	);
};
