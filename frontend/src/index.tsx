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
	// MO TODO route / to /app if authorized else /home
	{ path: "/", component: lazy(() => import("./pages/Home/Home")) },

	{ path: "/home", component: lazy(() => import("./pages/Home/Home")) },

	{ path: "**", component: lazy(() => import("./pages/404/404")) },
];

render(() => <Router>{routes}</Router>, root);
