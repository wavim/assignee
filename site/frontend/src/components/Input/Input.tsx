export default (props: {
	type: "email" | "password";
	title: string;
	placeholder: string;
	validity?: string;
}) => {
	return (
		<div>
			<label class="font-jakarta text-text-primary text-2xl">
				{props.title}
			</label>
			<input
				type={props.type}
				inputmode={props.type === "email" ? "email" : "text"}
				autocomplete={props.type === "email" ? "email" : "current-password"}
				placeholder={props.placeholder}
				spellcheck="false"
				class="peer bg-input inset-ring-input-br font-jakarta placeholder:text-input-placeholder text-text-primary my-2 w-full p-2 text-lg inset-ring-1"
			></input>
			<p class="font-jakarta text-input-invalid text-right text-xl transition-opacity duration-300 ease-out peer-valid:opacity-0">
				{props.validity ?? ""}
			</p>
		</div>
	);
};
