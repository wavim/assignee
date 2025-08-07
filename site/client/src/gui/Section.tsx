import { JSXElement } from "solid-js";

export default (props: { head: string; deck: string; children: JSXElement }) => (
	<section class="font-jakarta flex flex-col gap-8 px-8 md:items-center md:gap-12">
		<h1 class="text-text-major w-4/5 text-4xl font-medium md:text-center md:text-7xl">
			{props.head}
		</h1>
		<p class="text-text-minor w-11/12 text-xl md:text-center md:text-2xl">{props.deck}</p>
		{props.children}
	</section>
);
