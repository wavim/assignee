import { Ref } from "solid-js";

import Wrap from "../utils/Wrap";

export default (props: {
	ref?: Ref<HTMLButtonElement>;
	name: string;
	class?: string;
	children?: string;
}) => (
	<Wrap pclass={props.class}>
		<button
			ref={props.ref}
			name={props.name}
			type="button"
			class="inset-ring-p-light group relative flex h-max w-max cursor-pointer items-center overflow-hidden rounded-full border-none bg-transparent inset-ring-3"
		>
			<div class="bg-p-light absolute top-0 right-0 left-0 h-full origin-top scale-y-0 transition-transform duration-200 ease-out group-hover:origin-bottom group-hover:scale-y-100"></div>
			<span class="bg-p-light font-p px-9 py-7 text-3xl font-medium mix-blend-difference">
				{props.children}
			</span>
		</button>
	</Wrap>
);
