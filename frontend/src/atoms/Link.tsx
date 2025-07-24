import { A, AnchorProps } from "@solidjs/router";

export default (props: AnchorProps) => (
	<A
		{...props}
		class="bg-button font-jakarta text-text-button shadow-shadow/75 w-max rounded-full px-5 py-3 text-xl transition duration-300 ease-out select-none hover:shadow-[0.2rem_0.3rem] active:shadow-[0.2rem_0.3rem]"
	>
		{props.children}
	</A>
);
