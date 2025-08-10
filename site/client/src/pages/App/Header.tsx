import { useNavigate } from "@solidjs/router";
import clsx from "clsx/lite";
import { Signal, createMemo } from "solid-js";
import { logout } from "../../api/auth.api";
import A11y from "../../gui/A11y";
import { defineI18n } from "../../gui/I18n";

const I18n = defineI18n({
	en: { teams: "Teams", tasks: "Tasks", logout: "Logout" },
	zh: { teams: "群組", tasks: "任務", logout: "登出" },
});
export type Route = "teams" | "tasks";

export default (props: { router: Signal<Route> }) => {
	const [route, navigate] = props.router;

	const Item = (props: { route: Route }) => {
		const t = I18n.useI18n();

		const on = createMemo(() => route() === props.route);

		return (
			<button
				type="button"
				onclick={() => navigate(props.route)}
				class={clsx(
					"font-jakarta h-full cursor-pointer rounded-full px-5 text-lg transition-colors duration-100 ease-out",
					on() && "bg-button",
					on() ? "text-text-alter" : "text-text-major",
				)}
			>
				{t(props.route)}
			</button>
		);
	};

	return (
		<I18n.I18n>
			<div class="h-18"></div>
			<header class="bg-main fixed z-50 flex h-18 w-full items-center gap-4">
				<A11y class="ml-4 h-1/2"></A11y>
				<span class="bg-overlay/75 box-content flex h-1/2 rounded-full p-1">
					<Item route="teams"></Item>
					<Item route="tasks"></Item>
				</span>
				<Logout></Logout>
			</header>
		</I18n.I18n>
	);
};

const Logout = () => {
	const t = I18n.useI18n();
	const navigate = useNavigate();

	return (
		<button
			type="button"
			onclick={() => {
				void logout();
				navigate("/", { replace: true });
			}}
			class="text-text-minor font-jakarta mr-6 ml-auto cursor-pointer text-lg"
		>{`${t("logout")} ›`}</button>
	);
};
