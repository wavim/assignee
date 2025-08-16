import { JSXElement, Setter } from "solid-js";
import { defineI18n } from "./I18n";
import Input from "./Input";

const I18n = defineI18n({ en: { search: "Search" }, zh: { search: "搜索" } });

export default (props: { search: Setter<string>; children?: JSXElement }) => (
	<I18n.I18n>
		<search>
			<form class="flex flex-wrap gap-2">
				<Input
					name={I18n.useI18n()("search")}
					spellcheck="false"
					autocomplete="off"
					oninput={(ev) => props.search(ev.target.value.toLowerCase())}
					class="min-w-max flex-1"
				></Input>
				{props.children}
			</form>
		</search>
	</I18n.I18n>
);
