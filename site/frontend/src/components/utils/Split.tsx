import { For } from "solid-js";

export default (props: { children: string; class?: string }) => {
	return (
		<>
			<For each={props.children.split(" ")}>
				{(item) => (
					<div
						class={`inline-block ${props.class ?? ""}`}
					>{`${item}\u00a0`}</div>
				)}
			</For>
		</>
	);
};
