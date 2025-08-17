import { Props } from "../types/props";
import Button2 from "./Button2";

export default (props: Props<"label"> & { name: string; pick: (file?: File) => unknown }) => {
	let input!: HTMLInputElement;

	const upload = () => {
		input.click();
	};

	return (
		<label
			{...props}
			onchange={() => props.pick(input.files?.item(0) ?? undefined)}
		>
			<input
				ref={input}
				type="file"
				name={props.name}
				class="hidden"
			></input>
			<Button2
				onclick={upload}
				class="text-lg"
			>
				{props.name}
			</Button2>
		</label>
	);
};
