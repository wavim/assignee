import { createSignal, lazy, Suspense } from "solid-js";
import { Dynamic } from "solid-js/web";
import Guard from "../../gui/Guard";
import Footer from "../Footer";
import Header, { Route } from "./Header";
import I18n from "./I18n";

const routes: Record<Route, ReturnType<typeof lazy>> = {
	teams: lazy(() => import("./Teams/Teams")),
	tasks: lazy(() => import("./Tasks/Tasks")),
};

export default () => {
	const $router = createSignal<Route>("teams");
	const [route] = $router;

	return (
		<Guard>
			<I18n.I18n>
				<Header router={$router}></Header>
				<Suspense>
					<Dynamic component={routes[route()]}></Dynamic>
				</Suspense>
				<Footer></Footer>
			</I18n.I18n>
		</Guard>
	);
};
