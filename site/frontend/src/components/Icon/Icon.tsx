export default (props: { class?: string; ref?: any }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-20 -15 140 140"
	>
		<path
			ref={props.ref}
			d="m50 10 50 100H0z"
			fill="none"
			stroke-width="20"
			class={`stroke-current ${props.class ?? ""}`}
		/>
	</svg>
);
