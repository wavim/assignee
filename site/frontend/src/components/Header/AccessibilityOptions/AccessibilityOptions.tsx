import { createMemo, createSignal, For, JSXElement } from "solid-js";
import { twMerge } from "tailwind-merge";

import { media } from "../../../accessibility/media";

//MO TODO option font/size inconsistent accross device
export default (props: { ref?: HTMLDivElement }) => {
	const [fontSize, setFontSize] = createSignal(media.getFontSize());

	const [colorTheme, setColorTheme] = createSignal(media.getColorTheme());

	const [reduceMotion, setReduceMotion] = createSignal(media.getReduceMotion());

	return (
		<div
			ref={props.ref}
			aria-label="Accessibility Options"
			class="absolute top-20 flex h-max w-full flex-col flex-wrap pl-4 text-3xl opacity-0"
		>
			<OptionPicker option="Font">
				<For each={["𝙰⁻", "𝙰", "𝙰⁺"]}>
					{(option, i) => {
						const size = (["small", "middle", "large"] as const)[i()];
						const active = createMemo(() => fontSize() === size);

						return (
							<Option
								label={`${size} font size`}
								active={active}
								action={() => {
									setFontSize(size);
									media.setFontSize(size);
								}}
							>
								{option}
							</Option>
						);
					}}
				</For>
			</OptionPicker>
			<OptionPicker option="Theme">
				<For each={["○", "◑", "●"]}>
					{(option, i) => {
						const theme = (["light", "system", "dark"] as const)[i()];
						const active = createMemo(() => colorTheme() === theme);

						return (
							<Option
								label={`${theme} color theme`}
								active={active}
								action={() => {
									setColorTheme(theme);
									media.setColorTheme(theme);
								}}
							>
								{option}
							</Option>
						);
					}}
				</For>
			</OptionPicker>
			<OptionPicker option="Motion">
				<For each={["✓", "◑", "✗"]}>
					{(option, i) => {
						const reduce = (["off", "system", "on"] as const)[i()];
						const active = createMemo(() => reduceMotion() === reduce);

						return (
							<Option
								label={`reduce motion ${reduce}`}
								active={active}
								action={() => {
									setReduceMotion(reduce);
									media.setReduceMotion(reduce);
								}}
							>
								{option}
							</Option>
						);
					}}
				</For>
			</OptionPicker>
		</div>
	);
};

const OptionPicker = (props: { option: string; children: JSXElement }) => (
	<div class="my-0.5 flex w-full justify-between">
		<span class="font-jakarta text-accessibility">{props.option}</span>
		<div class="border-accessibility-options-br w-1/2 rounded-lg px-1">
			{props.children}
		</div>
	</div>
);

const Option = (props: {
	label: string;
	children: string;
	active: () => boolean;
	action: () => any;
	class?: string;
}) => (
	<button
		type="button"
		aria-label={props.label}
		onclick={() => props.active() || props.action()}
		class={twMerge(
			"text-text-primary hover:text-accessibility-action active:text-accessibility-action inline-block w-1/3 cursor-pointer text-center transition-colors duration-500 select-none",
			props.active() && "text-accessibility",
			props.class,
		)}
	>
		{props.children}
	</button>
);
