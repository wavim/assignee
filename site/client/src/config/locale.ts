export type LocaleOpt = "os" | "en" | "zh";
export type LocaleVal = Exclude<LocaleOpt, "os">;

export function getLocale(): LocaleOpt {
	return (localStorage.getItem("language") as LocaleOpt | null) ?? "os";
}

export function resLocale(): LocaleVal {
	const option = getLocale();

	if (option !== "os") {
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

export function setLocale(option: LocaleOpt): void {
	localStorage.setItem("language", option);

	window.dispatchEvent(new Event("$update-locale"));
}
