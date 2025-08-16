import { A } from "@solidjs/router";
import { JSXElement } from "solid-js";

export default (props: { href: string; name: string; desc: string; children: JSXElement }) => (
	<A
		href={props.href}
		class="font-jakarta border-border block w-full rounded-lg border-1 p-4 text-left md:w-[calc((100%-2rem)/3)]"
	>
		<h1 class="text-text-major text-2xl font-medium">{props.name}</h1>
		<h2 class="text-text-minor mt-2 text-lg">{props.desc}</h2>
		<span class="text-text-minor mt-8 flex items-center gap-2 text-lg">{props.children}</span>
	</A>
);
