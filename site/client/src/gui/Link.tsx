import { A, AnchorProps } from "@solidjs/router";

export default (props: AnchorProps) => (
	<A
		{...props}
		class="bg-button font-jakarta text-text-button outline-button w-max rounded-full px-6 py-3 text-xl outline-2 outline-offset-0 transition-[outline-offset] duration-100 ease-out hover:outline-offset-2"
	></A>
);
