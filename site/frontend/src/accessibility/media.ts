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

	const languages = ["en", "zh"] as const;
	type Locale = (typeof languages)[number];

	export function getLanguage(type?: "option"): Locale | "system";
	export function getLanguage(type: "eval"): Locale;
	export function getLanguage(type: "option" | "eval" = "option") {
		const langOption =
			(localStorage.getItem("language") as Locale | "system" | null) ??
			"system";

		if (type === "option" || langOption !== "system") return langOption;

		for (const lang of navigator.languages) {
			const locale = lang.split("-", 1)[0];

			if (languages.includes(locale as Locale)) return locale;
		}

		return "en";
	}

	export function setLanguage(
		language: Locale | "system" = getLanguage(),
	): void {
		localStorage.setItem("language", language);

		window.dispatchEvent(new Event("assignee:SetLocale"));
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

		if (type === "option" || themeOption !== "system") return themeOption;

		return prefersDarkColorScheme.matches ? "dark" : "light";
	}

	export function setColorTheme(
		colorTheme: "light" | "dark" | "system" = getColorTheme(),
	): void {
		localStorage.setItem("colorTheme", colorTheme);

		document.documentElement.classList.toggle(
			"dark",
			getColorTheme("eval") === "dark",
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

		if (type === "option" || reduceOption !== "system") return reduceOption;

		return prefersReducedMotion.matches ? "on" : "off";
	}

	export function setReduceMotion(
		reduceMotion: "on" | "off" | "system" = getReduceMotion(),
		options?: { noreload?: boolean },
	): void {
		localStorage.setItem("reduceMotion", reduceMotion);

		document.documentElement.classList.toggle(
			"reduce-motion",
			getReduceMotion("eval") === "on",
		);

		if (!options?.noreload) location.reload();
	}
}

media.setFontSize();

media.setLanguage();
window.onlanguagechange = () => media.setLanguage();

media.setColorTheme();
prefersDarkColorScheme.onchange = () => media.setColorTheme();

media.setReduceMotion(undefined, { noreload: true });
prefersReducedMotion.onchange = () => media.setReduceMotion();
