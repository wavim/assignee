import { clsx } from "clsx/lite";
import { Props } from "../types/props";

export default (props: Props<"button"> & { pill?: boolean; full?: boolean }) => (
	<button
		{...props}
		type="button"
		class={clsx(
			props.class,
			"bg-button font-jakarta text-text-alter outline-button cursor-pointer px-6 py-3 text-xl outline-2 transition-[outline-offset] duration-100 ease-out hover:outline-offset-2 focus:outline-offset-2",
			props.full ? "w-full" : "w-max",
			props.pill ? "rounded-full" : "rounded-xl",
		)}
	></button>
);
