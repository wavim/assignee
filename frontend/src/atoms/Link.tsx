import { A, AnchorProps } from "@solidjs/router";

export default (props: AnchorProps) => (
	<A
		{...props}
		class="bg-button font-jakarta text-text-button shadow-shadow/75 w-max rounded-full px-6 py-3 text-xl inset-ring-white transition-[box-shadow_filter] duration-300 ease-out hover:inset-ring-2 hover:invert"
	></A>
);
