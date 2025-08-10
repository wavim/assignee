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
	{ path: "/", component: lazy(() => import("./pages/Pub/Home/Home")) },
	{ path: "/signin", component: lazy(() => import("./pages/Pub/Signin/Signin")) },
	{ path: "/signup", component: lazy(() => import("./pages/Pub/Signup/Signup")) },
	{ path: "/app", component: lazy(() => import("./pages/App/App")) },
	{ path: "*", component: lazy(() => import("./pages/Pub/E404/E404")) },
];

render(() => <Router>{routes}</Router>, root);
