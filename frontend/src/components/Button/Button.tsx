import { JSXElement } from "solid-js";

export default (props: { onclick?: () => any; children?: JSXElement }) => (
	<button
		type="button"
		onclick={props.onclick}
		class="bg-button font-jakarta text-button-text shadow-button-shadow w-max cursor-pointer rounded-full px-5 py-3 text-xl transition duration-300 ease-out select-none hover:shadow-[0.2rem_0.3rem] active:shadow-[0.2rem_0.3rem]"
	>
		{props.children}
	</button>
);
