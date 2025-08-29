import { BaseDict, flatten, Flatten, Translator, translator } from "@solid-primitives/i18n";
import {
	createContext,
	createMemo,
	createSignal,
	JSXElement,
	onCleanup,
	useContext,
} from "solid-js";
import { LocaleVal, resLocale } from "../config/locale";

export function defineI18n<D extends BaseDict>(dicts: Record<LocaleVal, D>) {
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

		return (
			<I18nContext.Provider value={translator(createMemo(() => flatten(dicts[locale()])))}>
				{props.children}
			</I18nContext.Provider>
		);
	};

	const useI18n = () => {
		const i18n = useContext(I18nContext);

		if (!i18n) {
			throw new Error("Missing I18n Context Provider");
		}

		return i18n;
	};

	return { I18n, useI18n };
}
