import { createSignal, lazy } from "solid-js";
import { createStore } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { members } from "../../api/user.api";
import Footer from "../../gui/Footer";
import Guard from "../../gui/Guard";
import { Status } from "../../types/status";
import Header, { Route } from "./Header";

const routes: Record<Route, ReturnType<typeof lazy>> = {
	teams: lazy(() => import("./Teams/Teams")),
	tasks: lazy(() => import("./Tasks/Tasks")),
};

export default () => {
	const $router = createSignal<Route>("teams");
	const [route] = $router;

	const [status, update] = createStore<Status>({ members: [] });

	void members().then((m) => {
		update("members", m);
	});

	return (
		<Guard>
			<Header router={$router}></Header>
			<Dynamic
				component={routes[route()]}
				status={status}
				update={update}
			></Dynamic>
			<Footer></Footer>
		</Guard>
	);
};
