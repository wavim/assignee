import { Refs } from "@solid-primitives/refs";
import clsx from "clsx/lite";
import { Accessor, createMemo, createSignal, JSXElement, splitProps } from "solid-js";
import { Props } from "../types/props";
import Button from "./Button";

export default (
	props: Props<"form"> & {
		label: string;
		error: Accessor<string | undefined>;
		check: (...val: string[]) => unknown;
		cback: (...val: string[]) => unknown;

		children: JSXElement;
	},
) => {
	const [input, refs] = createSignal<HTMLElement[]>([]);
	const inputs = createMemo(() =>
		input()
			.map((e) => e.querySelector("input"))
			.filter((i) => i !== null),
	);

	const [datum, rest] = splitProps(props, ["label", "error", "check", "cback"]);

	return (
		<form
			{...rest}
			oninput={() => datum.check(...inputs().map((i) => i.value))}
			class={clsx("flex flex-col gap-4", rest.class)}
		>
			<Refs ref={refs}>{props.children}</Refs>
			<Button
				onclick={() => datum.cback(...inputs().map((i) => i.value))}
				aria-label={datum.label}
				class="mt-4"
				full
			>
				{datum.error() ?? datum.label}
			</Button>
		</form>
	);
};
