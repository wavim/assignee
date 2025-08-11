import { createSignal, lazy } from "solid-js";
import { createStore } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { membership } from "../../../api/user.api";
import Guard from "../../../gui/Guard";
import { Status } from "../../../types/status";
import Footer from "../Footer";
import Header, { Route } from "../Header";

const routes: Record<Route, ReturnType<typeof lazy>> = {
	teams: lazy(() => import("./Teams/Teams")),
	tasks: lazy(() => import("./Tasks/Tasks")),
};

export default () => {
	const $router = createSignal<Route>("teams");
	const [route] = $router;

	const [status, update] = createStore<Status>({ membership: [] });

	void membership().then((m) => {
		update("membership", m);
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
