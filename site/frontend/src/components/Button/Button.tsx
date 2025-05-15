import { JSXElement } from "solid-js";
import { twMerge } from "tailwind-merge";

export default (props: {
	onclick?: () => any;
	class?: string;
	children?: JSXElement;
}) => (
	<button
		type="button"
		onclick={props.onclick}
		class={twMerge(
			"group inset-ring-button-invert relative flex h-max w-full cursor-pointer items-center border-none inset-ring-1 select-none",
			props.class,
		)}
	>
		<div class="bg-button-invert absolute top-0 right-0 left-0 h-full origin-right scale-x-0 transition-transform duration-300 ease-in-out group-hover:origin-left group-hover:scale-x-100 group-active:scale-x-100 group-active:transition-none"></div>
		<span class="text-button-invert font-jakarta group-hover:text-button group-active:text-button z-10 p-4 text-xl transition-colors duration-300 ease-in-out group-active:transition-none">
			<span class="">{props.children}</span>
			<span class="absolute right-4 left-auto">{"≫"}</span>
		</span>
	</button>
);
