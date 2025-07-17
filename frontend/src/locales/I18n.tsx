import {
	BaseDict,
	flatten,
	Flatten,
	resolveTemplate,
	Translator,
	translator,
} from "@solid-primitives/I18n";
import {
	createContext,
	createResource,
	createSignal,
	JSXElement,
	Setter,
	useContext,
} from "solid-js";
import { Locale, resLocale } from "./locale";

export function createI18n<D extends BaseDict>(module: string, EnDict: D) {
	type Dict = Flatten<D>;

	const I18nContext = createContext<[Translator<Dict>, Setter<Locale>]>();

	const I18n = (props: { children: JSXElement }) => {
		const [locale, setLocale] = createSignal<Locale>(resLocale());

		const [dict] = createResource(
			locale,
			async (locale) => {
				return flatten(await import(`./${module}/${locale}.json`)) as Dict;
			},
			{ initialValue: flatten(EnDict) },
		);

		const t = translator(dict, resolveTemplate);

		return <I18nContext.Provider value={[t, setLocale]}>{props.children}</I18nContext.Provider>;
	};

	const useI18n = () => {
		const context = useContext(I18nContext);

		if (!context) {
			throw new Error("not in i18n context provider");
		}

		return context;
	};

	return { I18n, useI18n };
}
