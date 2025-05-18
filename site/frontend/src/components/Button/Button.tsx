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
			"bg-button font-jakarta text-button-text shadow-button-shadow w-max cursor-pointer rounded-full px-5 py-3 text-xl transition duration-300 ease-out select-none hover:shadow-[0.2rem_0.3rem] active:shadow-[0.2rem_0.3rem]",
			props.class,
		)}
	>
		{props.children}
	</button>
);
