import { JSXElement, Ref } from "solid-js";

export default (props: {
	ref?: Ref<HTMLDivElement>;
	pclass?: string;
	class?: string;
	children?: JSXElement;
}) => (
	<div
		ref={props.ref}
		{...(props.class ? { class: props.pclass ?? "" + props.class } : {})}
	>
		{props.children}
	</div>
);
