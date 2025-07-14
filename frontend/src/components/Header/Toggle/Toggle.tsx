import { useI18n } from "../I18n";

export default (props: {
	ref: HTMLButtonElement;
	onclick: () => any;
	expanded: boolean;
}) => {
	const [t] = useI18n();

	return (
		<button
			ref={props.ref}
			type="button"
			title={t("accessibility.title")}
			class="group h-full cursor-pointer"
			onclick={props.onclick}
			aria-expanded={props.expanded}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class="fill-accessibility active:fill-text-primary hover:fill-text-primary group-disabled:fill-text-primary h-full transition-colors duration-300 select-none"
			>
				<path d="m13.5 6.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5S11.2 5 12 5s1.5.7 1.5 1.5z" />
				<path d="M6.05 8.69c-.18.52.11 1.09.63 1.26.18.06.35.12.53.17.32.1.77.23 1.29.36.58.14 1.27.3 1.97.4-.04.89-.16 1.54-.26 1.96L8.1 17.06c-.24.49-.04 1.1.45 1.34s1.09.04 1.34-.45L12 13.74l2.11 4.2c.25.5.84.7 1.34.45s.7-.85.45-1.34l-2.11-4.22c-.1-.43-.21-1.07-.26-1.96.7-.1 1.39-.25 1.97-.4.51-.13.97-.26 1.29-.36.18-.05.36-.1.53-.16.52-.17.81-.76.64-1.27-.17-.52-.74-.8-1.26-.63-.15.05-.31.1-.47.15-.31.09-.73.21-1.21.33-.99.25-2.14.47-3.01.47S9.99 8.78 9 8.53c-.49-.12-.91-.24-1.21-.33-.16-.05-.32-.1-.47-.15-.52-.17-1.1.11-1.27.63Z" />
				<path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Zm20 0C23 5.9 18.1 1 12 1 5.9 1 1 5.9 1 12S5.9 23 12 23s11-4.9 11-11Z" />
			</svg>
		</button>
	);
};
