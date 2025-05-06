import { JSXElement } from "solid-js";

export default (props: {
	name: string;
	class?: string;
	children?: JSXElement;
}) => (
	<button
		type="button"
		name={props.name}
		class={
			"group inset-ring-button-invert relative flex h-max w-max cursor-pointer items-center overflow-hidden rounded-lg border-none bg-transparent inset-ring-1" +
			(props.class ?? "")
		}
	>
		<div class="bg-button-invert absolute top-0 right-0 left-0 h-full origin-right scale-x-0 transition-transform duration-300 ease-in-out group-hover:origin-left group-hover:scale-x-100 group-active:scale-x-100 group-active:transition-none"></div>
		<span class="text-button-invert font-jakarta group-hover:text-button group-active:text-button z-10 p-3 text-xl transition-colors duration-300 ease-in-out group-active:transition-none">
			<span class="inline-block pr-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
				{props.children}
			</span>
			<span class="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-x-0.5">
				{"≫"}
			</span>
		</span>
	</button>
);
