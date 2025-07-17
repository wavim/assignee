export type Locale = "en" | "zh";

export function resLocale(): Locale {
	const option = localStorage.getItem("language") as Locale | "system" | null;

	if (option !== "system" && option !== null) {
		return option;
	}

	for (const lang of navigator.languages) {
		if (lang.startsWith("en")) {
			return "en";
		}

		if (lang.startsWith("zh")) {
			return "zh";
		}
	}

	return "en";
}
