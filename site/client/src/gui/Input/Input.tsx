import { createSignal, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Props } from "../../types/props";
import I18n from "./I18n";

export default (props: Props<"input">) => {
	const [blank, setBlank] = createSignal(true);
	const [shown, setShown] = createSignal(false);

	return (
		<I18n.I18n>
			<label class="font-jakarta relative flex items-center">
				<input
					{...props}
					bool:data-blank={blank()}
					type={shown() ? "text" : props.type}
					oninput={({ target }) =>
						setBlank(!target.value.trim().length)
					}
					class="text-text-major border-placeholder peer outline-outline w-full rounded-xl border-1 px-4 pt-6 pb-2"
				></input>
				<span class="text-placeholder ease-300 pointer-events-none absolute left-4 text-lg transition-all ease-out not-peer-data-blank:top-2 not-peer-data-blank:text-xs peer-focus:top-2 peer-focus:text-xs">
					{props.name}
				</span>
				<Show when={props.type === "password"}>
					<Reveal
						onclick={() => setShown(!shown())}
						shown={shown()}
						class={twMerge(
							shown()
								? "fill-text-major"
								: "fill-placeholder",
							"absolute right-4 w-6 cursor-pointer peer-data-blank:hidden",
						)}
					></Reveal>
				</Show>
			</label>
		</I18n.I18n>
	);
};

const Reveal = (props: Props<"button"> & { shown: boolean }) => {
	const t = I18n.useI18n();

	return (
		<button
			{...props}
			type="button"
			title={props.shown ? t("hide") : t("show")}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
			>
				<path d="m3.3 11.6A7 7 0 0110 6c3.2 0 6.1 2.3 6.7 5.6a.5.5 0 001-.2A8 8 0 0010 5a8 8 0 00-7.7 6.4.5.5 0 001 .2zM10 8a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm-2.5 3.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" />
			</svg>
		</button>
	);
};
