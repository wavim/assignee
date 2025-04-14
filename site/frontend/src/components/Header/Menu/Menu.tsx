export default (props: { class?: string; ref?: any }) => (
	<button
		ref={props.ref}
		class={`group flex h-2/3 cursor-pointer items-center bg-transparent ${props.class ?? ""}`}
	>
		<div></div>
		<div></div>
	</button>
);
