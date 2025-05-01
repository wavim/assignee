import { JSX, Ref } from "solid-js";

import Wrap from "../utils/Wrap";

export default (props: {
	ref?: Ref<HTMLInputElement>;

	type: "email" | "number" | "password" | "tel" | "text" | "url";
	name: string;
	title: string;
	placeholder: string;
	hint: string;

	autocomplete?: "on" | "off" | `${string} ${string}`;
	autocorrect?: "on" | "off";
	autocapitalize?: JSX.HTMLAutocapitalize;

	required?: boolean;
	spellcheck?: boolean;

	class?: string;
}) => (
	<Wrap pclass={props.class}>
		<div class="flex h-max items-center">
			<input
				{...{ ...props, hint: null }}
				class="peer valid:not-placeholder-shown:border-valid-blue invalid:border-invalid-red border-p-dark font-p w-xl rounded-2xl border-3 px-7 py-6 text-3xl font-medium transition-colors duration-500 ease-out"
			></input>
			<div class="font-p peer-valid:not-placeholder-shown:text-valid-blue peer-invalid:text-invalid-red text-p-dark pl-4 text-2xl font-medium">
				{props.hint}
			</div>
		</div>
	</Wrap>
);
