import { createMemo, createSignal, For, JSXElement } from "solid-js";
import { twMerge } from "tailwind-merge";

import { media } from "../../../accessibility/media";
import { useI18n } from "../I18n";

export default (props: {
	ref?: HTMLDivElement;
	enable: boolean;
	class?: string;
}) => {
	const [t] = useI18n();

	const [fontSize, setFontSize] = createSignal(media.getFontSize());

	const [language, setLanguage] = createSignal(media.getLanguage());

	const [colorTheme, setColorTheme] = createSignal(media.getColorTheme());

	const [reduceMotion, setReduceMotion] = createSignal(media.getReduceMotion());

	return (
		<div
			ref={props.ref}
			aria-label={t("options.label")}
			class={twMerge(
				"absolute top-20 flex h-max w-full flex-col flex-wrap pl-4 text-3xl",
				props.class,
			)}
		>
			<OptionPicker option={t("options.font.option")}>
				<For each={["𝙰⁻", "𝙰", "𝙰⁺"]}>
					{(option, i) => {
						const size = (["small", "middle", "large"] as const)[i()];
						const active = createMemo(() => fontSize() === size);

						return (
							<Option
								label={t("options.font.label", { size })}
								enable={props.enable}
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
			<OptionPicker option={t("options.lang.option")}>
				<For each={["◑", "𝙴", "中"]}>
					{(option, i) => {
						const lang = (["system", "en", "zh"] as const)[i()];
						const active = createMemo(() => language() === lang);

						return (
							<Option
								label={t("options.lang.label", { lang })}
								enable={props.enable}
								active={active}
								action={() => {
									setLanguage(lang);
									media.setLanguage(lang);
								}}
								class="font-jakarta not-first:scale-75"
							>
								{option}
							</Option>
						);
					}}
				</For>
			</OptionPicker>
			<OptionPicker option={t("options.theme.option")}>
				<For each={["◑", "○", "●"]}>
					{(option, i) => {
						const theme = (["system", "light", "dark"] as const)[i()];
						const active = createMemo(() => colorTheme() === theme);

						return (
							<Option
								label={t("options.theme.label", { theme })}
								enable={props.enable}
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
			<OptionPicker option={t("options.motion.option")}>
				<For each={["◑", "✓", "✗"]}>
					{(option, i) => {
						const reduce = (["system", "off", "on"] as const)[i()];
						const active = createMemo(() => reduceMotion() === reduce);

						return (
							<Option
								label={t("options.motion.label", { reduce })}
								enable={props.enable}
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

const OptionPicker = (props: { option?: string; children: JSXElement }) => (
	<div class="my-0.5 flex w-full justify-between">
		<span class="font-jakarta text-accessibility">{props.option}</span>
		<div class="border-accessibility-options-br flex w-1/2 rounded-lg px-1">
			{props.children}
		</div>
	</div>
);

const Option = (props: {
	label?: string;
	children: string;
	enable: boolean;
	active: () => boolean;
	action: () => any;
	class?: string;
}) => (
	<button
		type="button"
		aria-label={props.label}
		disabled={!props.enable}
		onclick={() => props.active() || props.action()}
		class={twMerge(
			"text-text-primary hover:text-accessibility-action active:text-accessibility-action inline-block flex-[1] cursor-pointer text-center font-serif transition-colors duration-500 select-none",
			props.active() && "text-accessibility",
			props.class,
		)}
	>
		{props.children}
	</button>
);
