import "./init";
import "./styles/index.css";

import { RouteDefinition, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { render } from "solid-js/web";

//MO TODO / routes to /app, and redirects to /home if unauthorized
const routes: RouteDefinition[] = [
	{ path: "/", component: lazy(() => import("./pages/Home/Home")) },
	{ path: "/home", component: lazy(() => import("./pages/Home/Home")) },
	{ path: "**", component: lazy(() => import("./pages/404/404")) },
];

render(() => <Router>{routes}</Router>, document.getElementById("root")!);
