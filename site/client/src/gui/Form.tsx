import { Refs } from "@solid-primitives/refs";
import { Accessor, createMemo, createSignal, For, splitProps } from "solid-js";
import { Props } from "../types/props";
import Button from "./Button";
import Input from "./Input";

export default (
	props: Props<"form"> & {
		input: Props<"input">[];
		label: string;
		error: Accessor<string | undefined>;
		check: (...val: string[]) => unknown;
		cback: (...val: string[]) => unknown;
	},
) => {
	const [input, refs] = createSignal<HTMLLabelElement[]>([]);
	const inputs = createMemo(() => input().map((l) => l.children.item(0) as HTMLInputElement));

	const [core, rest] = splitProps(props, ["label", "input", "error", "check", "cback"]);

	return (
		<form
			{...rest}
			oninput={() => core.check(...inputs().map((i) => i.value))}
		>
			<Refs ref={refs}>
				<For each={core.input}>{(props) => <Input {...props}></Input>}</For>
			</Refs>
			<Button
				onclick={() => core.cback(...inputs().map((i) => i.value))}
				aria-label={core.label}
				full
			>
				{core.error() ?? core.label}
			</Button>
		</form>
	);
};
