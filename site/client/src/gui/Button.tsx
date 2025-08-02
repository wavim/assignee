import { twMerge } from "tailwind-merge";
import { Props } from "../types/props";

// MO TODO draft
export default (props: Props<"button">) => (
	<button
		{...props}
		type="button"
		class={twMerge(
			"bg-button font-jakarta text-text-button outline-button rounded-2xl py-3 text-xl outline-2 outline-offset-0 transition-[outline-offset] duration-100 ease-out hover:outline-offset-2",
			props.class,
		)}
	></button>
);
