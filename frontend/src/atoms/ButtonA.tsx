import { A } from "@solidjs/router";
import { JSXElement } from "solid-js";

export default (props: { href: string; children?: JSXElement }) => (
	<A
		href={props.href}
		class="bg-button font-jakarta text-text-button shadow-button-shadow w-max rounded-full px-5 py-3 text-xl transition duration-300 ease-out select-none hover:shadow-[0.2rem_0.3rem] active:shadow-[0.2rem_0.3rem]"
	>
		{props.children}
	</A>
);
