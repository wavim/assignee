import clsx from "clsx/lite";
import { Signal, createMemo } from "solid-js";
import Header from "../Header";
import I18n from "./I18n";

export type Route = "teams" | "tasks";

export default (props: { router: Signal<Route> }) => {
	const [route, navigate] = props.router;

	const Item = (props: { route: Route }) => {
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
				{I18n.useI18n()(`${props.route}.name`)}
			</button>
		);
	};

	return (
		<Header>
			<span class="bg-overlay/75 box-content flex h-1/2 rounded-full p-1">
				<Item route="teams"></Item>
				<Item route="tasks"></Item>
			</span>
		</Header>
	);
};
