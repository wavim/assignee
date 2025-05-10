const prefersDarkColorScheme = window.matchMedia(
	"(prefers-color-scheme: dark)",
);

const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
);

export namespace media {
	export function getFontSize(): "small" | "middle" | "large" {
		return (
			(localStorage.getItem("fontSize") as
				| "small"
				| "middle"
				| "large"
				| null) ?? "middle"
		);
	}

	export function setFontSize(
		fontSize: "small" | "middle" | "large" = getFontSize(),
	): void {
		localStorage.setItem("fontSize", fontSize);

		document.documentElement.style.fontSize = {
			small: "80%",
			middle: "100%",
			large: "120%",
		}[fontSize];
	}

	export function getColorTheme(type?: "option"): "light" | "dark" | "system";
	export function getColorTheme(type: "eval"): "light" | "dark";
	export function getColorTheme(type: "option" | "eval" = "option") {
		const themeOption =
			(localStorage.getItem("colorTheme") as
				| "light"
				| "dark"
				| "system"
				| null) ?? "system";

		if (type === "option") return themeOption;

		return themeOption === "system"
			? prefersDarkColorScheme.matches
				? "dark"
				: "light"
			: themeOption;
	}

	export function setColorTheme(
		colorTheme: "light" | "dark" | "system" = getColorTheme(),
	): void {
		localStorage.setItem("colorTheme", colorTheme);

		document.documentElement.classList.toggle(
			"dark",
			media.getColorTheme("eval") === "dark",
		);
	}

	export function getReduceMotion(type?: "option"): "on" | "off" | "system";
	export function getReduceMotion(type: "eval"): "on" | "off";
	export function getReduceMotion(type: "option" | "eval" = "option") {
		const reduceOption =
			(localStorage.getItem("reduceMotion") as
				| "on"
				| "off"
				| "system"
				| null) ?? "system";

		if (type === "option") return reduceOption;

		return reduceOption === "system"
			? prefersReducedMotion.matches
				? "on"
				: "off"
			: reduceOption;
	}

	export function setReduceMotion(
		reduceMotion: "on" | "off" | "system" = getReduceMotion(),
		options?: { noreload?: boolean },
	): void {
		localStorage.setItem("reduceMotion", reduceMotion);

		document.documentElement.classList.toggle(
			"reduce-motion",
			media.getReduceMotion("eval") === "on",
		);

		if (!options?.noreload) location.reload();
	}
}

media.setFontSize();

media.setColorTheme();
prefersDarkColorScheme.onchange = () => media.setColorTheme();

media.setReduceMotion(undefined, { noreload: true });
prefersReducedMotion.onchange = () => media.setReduceMotion();
