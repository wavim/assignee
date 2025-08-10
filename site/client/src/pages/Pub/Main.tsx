import { JSXElement } from "solid-js";

export default (props: { children: JSXElement }) => (
	<main class="flex w-full flex-col gap-16 md:gap-24">{props.children}</main>
);
