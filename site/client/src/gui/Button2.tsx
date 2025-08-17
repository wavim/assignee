import clsx from "clsx/lite";
import { Props } from "../types/props";

export default (props: Props<"button"> & {}) => (
	<button
		{...props}
		type="button"
		class={clsx("font-jakarta text-text-major cursor-pointer", props.class)}
	>
		{props.children} ›
	</button>
);
