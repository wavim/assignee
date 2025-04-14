import { For } from "solid-js";

export default (props: { children: string; class?: string }) => {
	return (
		<>
			<For each={props.children.split(" ")}>
				{(word) => (
					<div
						class={`inline-block ${props.class ?? ""}`}
					>{`${word}\u00a0`}</div>
				)}
			</For>
		</>
	);
};
