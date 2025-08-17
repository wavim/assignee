import { clsx } from "clsx/lite";
import { createSignal } from "solid-js";
import { Props } from "../types/props";

let $id = 0;

export default (props: Props<"span"> & { name: string }) => {
	const [blank, setBlank] = createSignal(true);
	const id = `textarea-${String($id++)}`;

	return (
		<div
			id={id}
			class={clsx("font-jakarta relative flex cursor-text items-center", props.class)}
		>
			<span
				{...props}
				role="textbox"
				contenteditable
				aria-labelledby={id}
				on:input={({ target }) => setBlank(!target.textContent.length)}
				class="text-text-major border-holder peer outline-outline max-h-40 w-full overflow-auto rounded-xl border-1 px-4 pt-6 pb-2 text-base whitespace-pre-wrap"
			>
				<br></br>
			</span>
			<span
				class={clsx(
					blank() ? "text-lg" : "top-2 text-xs",
					"text-holder ease-300 pointer-events-none absolute left-4 transition-all ease-out peer-focus:top-2 peer-focus:text-xs",
				)}
			>
				{props.name}
			</span>
		</div>
	);
};
