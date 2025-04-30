export default (props: {
	type: "text" | "email";
	name: string;
	title: string;
	hint: string;
	placeholder: string;
	ref?: any;
	class?: string;
	required?: boolean;
	nospellcheck?: boolean;
	noautocorr?: boolean;
	autocap?: "off" | "none" | "on" | "sentences" | "words" | "characters";
}) => (
	<div class={`flex h-max items-center ${props.class ?? ""}`}>
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
			class="peer valid:not-placeholder-shown:border-valid-blue invalid:border-invalid-red border-p-dark font-p w-xl rounded-2xl border-3 px-7 py-6 text-3xl font-medium transition-colors duration-500 ease-out"
		></input>
		<div class="font-p peer-valid:not-placeholder-shown:text-valid-blue peer-invalid:text-invalid-red text-p-dark pl-4 text-2xl font-medium">
			{props.hint}
		</div>
	</div>
);
