import {
	BaseDict,
	flatten,
	Flatten,
	resolveTemplate,
	Translator,
	translator,
} from "@solid-primitives/i18n";
import {
	createContext,
	createResource,
	createSignal,
	JSXElement,
	onCleanup,
	Setter,
	useContext,
} from "solid-js";

import { media } from "../../accessibility/media";

export const getI18n = <T extends BaseDict>(
	module: string,
	enDictionary: T,
) => {
	type Locale = "en" | "zh";

	type Dictionary = Flatten<T>;

	const enDictionaryFlat = flatten(enDictionary);

	const i18nContext =
		createContext<[Translator<Flatten<T>, string>, Setter<Locale>]>();

	const useI18n = () => useContext(i18nContext)!;

	const I18n = (props: { children: JSXElement }) => {
		const [locale, setLocale] = createSignal<Locale>(media.getLanguage("eval"));

		const setLocaleCallback = () => setLocale(media.getLanguage("eval"));
		window.addEventListener("assignee:SetLocale", setLocaleCallback);
		onCleanup(() =>
			window.removeEventListener("assignee:SetLocale", setLocaleCallback),
		);

		const [dict] = createResource(locale, fetchDictionary, {
			initialValue: enDictionaryFlat,
		});

		const t = translator(dict, resolveTemplate);

		return (
			<i18nContext.Provider value={[t, setLocale]}>
				{props.children}
			</i18nContext.Provider>
		);
	};

	async function fetchDictionary(locale: Locale): Promise<Dictionary> {
		const dict: T = await import(`../../locales/${module}/${locale}.json`);
		return flatten(dict);
	}

	return { I18n, useI18n };
};
