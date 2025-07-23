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
	onCleanup,
	useContext,
} from "solid-js";
import { LocaleVal, resLocale } from "../configs/locale";

export function createI18n<D extends BaseDict>(module: string, enDict: D) {
	type Dict = Flatten<D>;

	const I18nContext = createContext<Translator<Dict>>();

	const I18n = (props: { children: JSXElement }) => {
		const [locale, setLocale] = createSignal<LocaleVal>(resLocale());

		const updateLocale = () => {
			setLocale(resLocale());
		};
		window.addEventListener("$update-locale", updateLocale);

		onCleanup(() => {
			window.removeEventListener("$update-locale", updateLocale);
		});

		const [dict] = createResource(
			locale,
			async (locale) => {
				return flatten(await import(`./${locale}/${module}.json`)) as Dict;
			},
			{ initialValue: flatten(enDict) },
		);

		const t = translator(dict, resolveTemplate);

		return <I18nContext.Provider value={t}>{props.children}</I18nContext.Provider>;
	};

	const useI18n = () => {
		const context = useContext(I18nContext);

		if (!context) {
			throw new Error("not in i18n context");
		}
		return context;
	};

	return { I18n, useI18n };
}
