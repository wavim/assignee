import clsx from "clsx/lite";
import { Signal, createMemo } from "solid-js";
import { defineI18n } from "../../gui/I18n";
import Header from "../Header";

const I18n = defineI18n({
	en: { teams: "Teams", tasks: "Tasks" },
	zh: { teams: "群組", tasks: "任務" },
});
export type Route = "teams" | "tasks";

export default (props: { router: Signal<Route> }) => {
	const [route, navigate] = props.router;

	const Item = (props: { route: Route }) => {
		const t = I18n.useI18n();

		const view = createMemo(() => route() === props.route);

		return (
			<button
				type="button"
				onclick={() => navigate(props.route)}
				class={clsx(
					"font-jakarta h-full cursor-pointer rounded-full px-5 text-lg transition-colors duration-100 ease-out",
					view() && "bg-button",
					view() ? "text-text-alter" : "text-text-major",
				)}
			>
				{t(props.route)}
			</button>
		);
	};

	return (
		<I18n.I18n>
			<Header>
				<span class="bg-overlay/75 box-content flex h-1/2 rounded-full p-1">
					<Item route="teams"></Item>
					<Item route="tasks"></Item>
				</span>
			</Header>
		</I18n.I18n>
	);
};
