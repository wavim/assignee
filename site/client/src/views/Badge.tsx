import { Props } from "../types/props";

export default (props: Props<"div"> & { auth: boolean }) => (
	<div {...props}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="stroke-text-minor h-full fill-none stroke-[1.5]"
		>
			{props.auth ? (
				<path d="m9 12 2 2 4-4m-3-7 2 1.9 2.5-.7.7 2.6 2.6.7-.7 2.6L21 12l-1.9 2 .7 2.5-2.6.7-.7 2.6-2.6-.7L12 21l-2-1.9-2.5.7-.7-2.6-2.6-.7.7-2.6L3 12l1.9-2-.7-2.5 2.6-.7.7-2.6 2.6.7L12 3z" />
			) : (
				<path d="m7.5 11.8L12 14l7-3.5M7.5 11.8v6m0-6L12 9.6m-4.5 2.2L5 10.5m2.5 7.3V21m0-3.2L12 20l7-3.5v-6M7.5 17.8 5 16.5v-6m14 0 3-1.5-10-5L2 9l3 1.5" />
			)}
		</svg>
	</div>
);
