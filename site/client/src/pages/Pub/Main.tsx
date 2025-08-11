import { JSXElement } from "solid-js";

export default (props: { children: JSXElement }) => (
	<main class="flex w-full flex-col gap-16 md:gap-0">{props.children}</main>
);
