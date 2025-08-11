import "./styles/index.css";

import { RouteDefinition, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { init } from "./init";

const root = document.getElementById("root");

if (!root) {
	throw new Error("missing app root");
}

void init();

const routes: RouteDefinition[] = [
	{ path: "/", component: lazy(() => import("./pages/Home/Home")) },
	{ path: "/signin", component: lazy(() => import("./pages/Signin/Signin")) },
	{ path: "/signup", component: lazy(() => import("./pages/Signup/Signup")) },

	{ path: "/dash", component: lazy(() => import("./views/Dash/Dash")) },
	{ path: "/team/:hash", component: lazy(() => import("./views/Team/Team")) },

	{ path: "*", component: lazy(() => import("./pages/E404/E404")) },
];

render(() => <Router>{routes}</Router>, root);
