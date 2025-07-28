import { A, AnchorProps } from "@solidjs/router";

export default (props: AnchorProps) => (
	<A
		{...props}
		class="bg-button font-jakarta text-text-button shadow-shadow/75 hover:bg-text-button hover:text-button inset-ring-button w-max rounded-full px-6 py-3 text-xl inset-ring-2 transition-colors duration-300 ease-out"
	></A>
);
