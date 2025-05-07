// import { JSX, Ref } from "solid-js";

// import Wrap from "../utils/Wrap";

// 		<div class="flex h-max items-center">
// 			<input
// 				{...{ ...props, hint: null }}
// 				class="peer valid:not-placeholder-shown:border-valid-blue invalid:border-invalid-red border-p-dark font-p w-xl rounded-2xl border-3 px-7 py-6 text-3xl font-medium transition-colors duration-500 ease-out"
// 			></input>
// 			<div class="font-p peer-valid:not-placeholder-shown:text-valid-blue peer-invalid:text-invalid-red text-p-dark pl-4 text-2xl font-medium">
// 				{props.hint}
// 			</div>
// 		</div>

// export default (props: {
// 	type: "text" | "number" | "email" | "password";
// 	title: string;
// 	placeholder: string;
// 	name: string;
// 	hint: string;
// 	class?: string;
// }) => (
// 	<div class={" " + (props.class ?? "")}>
// 		<input
// 			type={props.type}
// 			title={props.title}
// 			placeholder={props.placeholder}
// 			name={props.name}
// 		></input>
// 		<span>{props.hint}</span>
// 	</div>
// );
