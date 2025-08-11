import { createSignal, lazy } from "solid-js";
import { Dynamic } from "solid-js/web";
import Guard from "../../../gui/Guard";
import Footer from "../Footer";
import Header, { Route } from "../Header";

const routes: Record<Route, ReturnType<typeof lazy>> = {
	teams: lazy(() => import("./Teams/Teams")),
	tasks: lazy(() => import("./Tasks/Tasks")),
};

export default () => {
	const $router = createSignal<Route>("teams");
	const [route] = $router;

	return (
		<Guard>
			<Header router={$router}></Header>
			<Dynamic
				component={routes[route()]}
			></Dynamic>
			<Footer></Footer>
		</Guard>
	);
};
