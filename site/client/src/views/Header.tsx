import { useNavigate } from "@solidjs/router";
import { JSXElement } from "solid-js";
import { logout } from "../api/users.api";
import A11y from "../gui/A11y";
import { defineI18n } from "../gui/I18n";

const I18n = defineI18n({ en: { logout: "Logout" }, zh: { logout: "登出" } });

export default (props: { children?: JSXElement }) => (
	<I18n.I18n>
		<div class="h-18"></div>
		<header class="bg-main fixed z-50 flex h-18 w-full items-center gap-4">
			<A11y class="ml-4 h-1/2"></A11y>
			{props.children}
			<Logout></Logout>
		</header>
	</I18n.I18n>
);

const Logout = () => {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			onclick={() => {
				void logout();
				navigate("/", { replace: true });
			}}
			class="text-text-minor font-jakarta mr-6 ml-auto cursor-pointer text-lg"
		>
			{I18n.useI18n()("logout")}
		</button>
	);
};
