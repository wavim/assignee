import { flatten, Flatten, translator } from "@solid-primitives/i18n";
import {
	createContext,
	createResource,
	createSignal,
	JSXElement,
	Setter,
	useContext,
} from "solid-js";

import enDictionary from "../../locales/Home/en.json";

type Locale = "en" | "zh-Hans" | "zh-Hant";

type RawDictionary = typeof enDictionary;
type Dictionary = Flatten<RawDictionary>;

const i18nContext =
	createContext<[ReturnType<typeof translator<Dictionary>>, Setter<Locale>]>();

export const useI18n = () => useContext(i18nContext)!;

export default (props: { children: JSXElement }) => {
	const [locale, setLocale] = createSignal<Locale>("en");

	const [dict] = createResource(locale, fetchDictionary, {
		initialValue: flatten(enDictionary),
	});

	const t = translator(dict);

	return (
		<i18nContext.Provider value={[t, setLocale]}>
			{props.children}
		</i18nContext.Provider>
	);
};

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
	const dict: RawDictionary = await import(`../../locales/Home/${locale}.json`);
	return flatten(dict);
}
