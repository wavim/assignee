import gsap from "gsap";
import { createSignal, For } from "solid-js";
import { twMerge } from "tailwind-merge";

export default (props: { ref?: HTMLDivElement }) => {
	const [fontSize, setFontSize] = createSignal(
		(localStorage.getItem("fontSize") as "small" | "mid" | "large" | null) ??
			"mid",
	);

	gsap.set(document.documentElement, {
		fontSize: { small: "80%", mid: "100%", large: "120%" }[fontSize()],
	});

	const [colorTheme, setColorTheme] = createSignal(
		(localStorage.getItem("colorTheme") as
			| "light"
			| "system"
			| "dark"
			| null) ?? "system",
	);

	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
	prefersDarkScheme.onchange = ({ matches }) => {
		if (colorTheme() === "system") {
			document.documentElement.classList.toggle("dark", matches);
		}
	};
	if (
		colorTheme() === "dark" ||
		(colorTheme() === "system" && prefersDarkScheme.matches)
	) {
		document.documentElement.classList.add("dark");
	}

	return (
		<div
			ref={props.ref}
			aria-label="Accessibility Options"
			class="absolute top-20 flex h-max w-full flex-col flex-wrap px-4 text-3xl opacity-0"
		>
			<div class="my-0.5 flex w-full justify-between px-2">
				<span class="font-jakarta text-accessibility">Font</span>
				<div class="border-accessibility-options-br w-1/2 rounded-lg px-1">
					<For each={["𝙰⁻", "𝙰", "𝙰⁺"]}>
						{(option, i) => {
							const size = ["small", "mid", "large"][i()] as
								| "small"
								| "mid"
								| "large";

							return (
								<button
									onclick={() => {
										setFontSize(size);

										gsap.set(document.documentElement, {
											fontSize: { small: "80%", mid: "100%", large: "120%" }[
												size
											],
										});

										localStorage.setItem("fontSize", size);
									}}
									class={twMerge(
										"text-text-primary hover:text-accessibility-action active:text-accessibility-action inline-block w-1/3 cursor-pointer text-center font-sans transition-colors duration-500 select-none",
										fontSize() === size ? "text-accessibility" : "",
									)}
								>
									{`${option}\u{0000FE0E}`}
								</button>
							);
						}}
					</For>
				</div>
			</div>
			<div class="my-0.5 flex w-full justify-between px-2">
				<span class="font-jakarta text-accessibility">Theme</span>
				<div class="border-accessibility-options-br w-1/2 rounded-lg px-1">
					<For each={["○", "◑", "●"]}>
						{(option, i) => {
							const theme = ["light", "system", "dark"][i()] as
								| "light"
								| "system"
								| "dark";

							return (
								<button
									onclick={() => {
										setColorTheme(theme);

										localStorage.setItem("colorTheme", theme);

										document.documentElement.classList.toggle(
											"dark",
											theme === "dark" ||
												(theme === "system" &&
													window.matchMedia("(prefers-color-scheme: dark)")
														.matches),
										);
									}}
									class={twMerge(
										"text-text-primary hover:text-accessibility-action active:text-accessibility-action inline-block w-1/3 cursor-pointer text-center font-mono transition-colors duration-500 select-none",
										colorTheme() === theme ? "text-accessibility" : "",
									)}
								>
									{`${option}\u{0000FE0E}`}
								</button>
							);
						}}
					</For>
				</div>
			</div>
		</div>
	);
};
