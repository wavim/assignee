export default (props: {
	type: "text" | "email";
	name: string;
	title: string;
	placeholder: string;
	hints: any;
	ref?: any;
	class?: string;
	required?: boolean;
	nospellcheck?: boolean;
	noautocorr?: boolean;
	autocap?: "off" | "none" | "on" | "sentences" | "words" | "characters";
}) => (
	<div class="flex h-max items-center">
		<input
			type={props.type}
			name={props.name}
			title={props.title}
			placeholder={props.placeholder}
			spellcheck={!props.nospellcheck}
			autocorrect={props.noautocorr ? "off" : "on"}
			autocapitalize={props.autocap}
			required={props.required}
			ref={props.ref}
			class={`border-p-dark font-p w-xl rounded-2xl border-3 px-7 py-6 text-3xl font-medium ${props.class ?? ""}`}
		></input>
		<div class="font-p text-invalid-red pl-4 text-2xl font-medium">
			{props.hints}
		</div>
	</div>
);
