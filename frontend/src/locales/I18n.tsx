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

export function defineI18n<D extends BaseDict>(dicts: Record<LocaleVal, D>) {
	return $createI18n(dicts.en, (locale) => dicts[locale]);
}

export function importI18n<D extends BaseDict>(en: D, name: string) {
	return $createI18n(en, (locale) => import(`./${locale}/${name}.json`) as Promise<D>);
}

function $createI18n<D extends BaseDict>(init: D, callback: (locale: LocaleVal) => D | Promise<D>) {
	const I18nContext = createContext<Translator<Flatten<D>>>();

	const I18n = (props: { children: JSXElement }) => {
		const [locale, setLocale] = createSignal(resLocale());

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
				return flatten(await callback(locale));
			},
			{ initialValue: flatten(init) },
		);

		return (
			<I18nContext.Provider value={translator(dict, resolveTemplate)}>
				{props.children}
			</I18nContext.Provider>
		);
	};

	const useI18n = () => {
		const i18n = useContext(I18nContext);

		if (!i18n) {
			throw new Error("missing i18n context provider");
		}

		return i18n;
	};

	return { I18n, useI18n };
}
