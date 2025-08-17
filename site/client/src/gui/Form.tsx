import { Refs } from "@solid-primitives/refs";
import clsx from "clsx/lite";
import { Accessor, createMemo, createSignal, JSXElement, splitProps } from "solid-js";
import { Props } from "../types/props";
import Button1 from "./Button1";

export default (
	props: Props<"form"> & {
		label: string;
		cback: (...val: string[]) => unknown;
		check?: (...val: string[]) => unknown;
		error?: Accessor<string | undefined>;

		children: JSXElement;
	},
) => {
	const [input, refs] = createSignal<HTMLElement[]>([]);
	const inputs = createMemo(() =>
		input()
			.map((e) => e.querySelector("input, span[role=textbox]"))
			.filter((i) => i !== null),
	);

	const [datum, rest] = splitProps(props, ["label", "error", "check", "cback"]);

	return (
		<form
			{...rest}
			oninput={() =>
				datum.check?.(
					...inputs().map((i) => (i instanceof HTMLInputElement ? i.value : i.textContent)),
				)
			}
			class={clsx("flex flex-col gap-4", rest.class)}
		>
			<Refs ref={refs}>{props.children}</Refs>
			<Button1
				onclick={() =>
					datum.cback(
						...inputs().map((i) => (i instanceof HTMLInputElement ? i.value : i.textContent)),
					)
				}
				aria-label={datum.label}
				class="mt-4"
				full
			>
				{datum.error?.() ?? datum.label}
			</Button1>
		</form>
	);
};
