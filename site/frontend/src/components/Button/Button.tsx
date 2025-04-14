export default (props: { children?: string; class?: string; ref?: any }) => (
	<button
		ref={props.ref}
		class={`inset-ring-p-light group relative flex h-max w-max cursor-pointer items-center overflow-hidden rounded-full border-none bg-transparent inset-ring-3 ${props.class ?? ""}`}
	>
		<div class="bg-p-light absolute top-0 right-0 left-0 h-full origin-top scale-y-0 transition-transform duration-200 ease-out group-hover:origin-bottom group-hover:scale-y-100"></div>
		<span class="bg-p-light font-p px-9 py-7 text-3xl font-medium mix-blend-difference">
			{props.children}
		</span>
	</button>
);
