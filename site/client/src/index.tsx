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

	{ path: "/app", component: lazy(() => import("./pages/App/App")) },

	{ path: "*", component: lazy(() => import("./pages/404/404")) },
];

render(() => <Router>{routes}</Router>, root);
