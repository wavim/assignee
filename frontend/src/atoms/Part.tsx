import { JSXElement } from "solid-js";
import { twMerge } from "tailwind-merge";

export default (props: {
	title: string;
	subtitle: string;
	children: JSXElement;
	class?: string;
}) => (
	<section class="font-jakarta flex flex-col gap-8 px-8 md:items-center md:gap-12">
		<h1
			class={twMerge(
				"text-text-major w-4/5 text-4xl font-medium md:text-center md:text-5xl",
				props.class,
			)}
		>
			{props.title}
		</h1>
		<p class="text-text-minor w-11/12 text-xl md:text-center md:text-2xl">
			{props.subtitle}
		</p>
		{props.children}
	</section>
);
