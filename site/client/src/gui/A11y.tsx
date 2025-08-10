import { For } from "solid-js";
import { getFontSize, setFontSize } from "../configs/font-size";
import { getLocale, setLocale } from "../configs/locale";
import { getMedia, setMedia } from "../configs/media";
import { Props } from "../types/props";
import { defineI18n } from "./I18n";
import Modal from "./Modal";

const I18n = defineI18n({
	en: {
		name: "Accessibility",
		os: "System",
		fontsize: { name: "Font Size", sm: "Small", md: "Medium", lg: "Large" },
		language: { name: "Language" },
		darkmode: { name: "Color Theme", no: "Light", on: "Dark" },
		rdmotion: { name: "Motion Effects", no: "On", on: "Off" },
	},
	zh: {
		name: "輔助使用",
		os: "系統",
		fontsize: { name: "字號", sm: "較小", md: "中等", lg: "較大" },
		language: { name: "語言" },
		darkmode: { name: "主題", no: "亮色", on: "暗色" },
		rdmotion: { name: "動效", no: "開啟", on: "關閉" },
	},
});

export default (props: Props<"button">) => {
	let toggle!: HTMLButtonElement;

	return (
		<I18n.I18n>
			<Toggle
				{...props}
				ref={toggle}
			></Toggle>
			<Menu toggle={toggle}></Menu>
		</I18n.I18n>
	);
};

const Toggle = (props: Props<"button">) => {
	const t = I18n.useI18n();

	return (
		<button
			{...props}
			type="button"
			title={t("name")}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class="fill-a11y h-full cursor-pointer"
			>
				<path d="m13.5 6.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5S11.2 5 12 5s1.5.7 1.5 1.5" />
				<path d="m6.05 8.69c-.18.52.11 1.09.63 1.26.18.06.35.12.53.17.32.1.77.23 1.29.36.58.14 1.27.3 1.97.4-.04.89-.16 1.54-.26 1.96L8.1 17.06c-.24.49-.04 1.1.45 1.34s1.09.04 1.34-.45L12 13.74l2.11 4.2c.25.5.84.7 1.34.45s.7-.85.45-1.34l-2.11-4.22c-.1-.43-.21-1.07-.26-1.96.7-.1 1.39-.25 1.97-.4.51-.13.97-.26 1.29-.36.18-.05.36-.1.53-.16.52-.17.81-.76.64-1.27a1 1 0 00-1.26-.63c-.15.05-.31.1-.47.15-.31.09-.73.21-1.21.33-.99.25-2.14.47-3.01.47S9.99 8.78 9 8.53c-.49-.12-.91-.24-1.21-.33-.16-.05-.32-.1-.47-.15-.52-.17-1.1.11-1.27.63z" />
				<path d="m3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9m20 0c0-6.1-4.9-11-11-11S1 5.9 1 12s4.9 11 11 11 11-4.9 11-11" />
			</svg>
		</button>
	);
};

const Menu = (props: { toggle: HTMLButtonElement }) => {
	const t = I18n.useI18n();

	return (
		<Modal
			toggle={props.toggle}
			class="flex w-72 flex-col gap-6"
		>
			<Config
				name={t("fontsize.name")}
				options={{ sm: t("fontsize.sm"), md: t("fontsize.md"), lg: t("fontsize.lg") }}
				default={getFontSize()}
			>
				{setFontSize}
			</Config>
			<Config
				name={t("language.name")}
				options={{ os: t("os"), en: "English", zh: "中文(繁)" }}
				default={getLocale()}
			>
				{setLocale}
			</Config>
			<Config
				name={t("darkmode.name")}
				options={{ os: t("os"), no: t("darkmode.no"), on: t("darkmode.on") }}
				default={getMedia("darkmode")}
			>
				{(option) => {
					setMedia("darkmode", option);
				}}
			</Config>
			<Config
				name={t("rdmotion.name")}
				options={{ os: t("os"), no: t("rdmotion.no"), on: t("rdmotion.on") }}
				default={getMedia("rdmotion")}
			>
				{(option) => {
					setMedia("rdmotion", option);
					location.reload();
				}}
			</Config>
		</Modal>
	);
};

const Config = <T extends string>(props: {
	name: string;
	options: Record<T, string>;
	default: T;
	children: (option: T) => void;
}) => (
	<label class="font-jakarta flex text-xl">
		<span class="text-text-minor flex-1">{props.name}</span>
		<select
			name={props.name}
			onchange={({ target }) => {
				const option = target.selectedOptions[0];
				props.children(option.dataset.key as T);
			}}
			class="text-text-major w-30"
		>
			<For each={Object.entries<string>(props.options)}>
				{([key, value]) => (
					<option
						data-key={key}
						selected={key === props.default}
						class="bg-main"
					>
						{value}
					</option>
				)}
			</For>
		</select>
	</label>
);
