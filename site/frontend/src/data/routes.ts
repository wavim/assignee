import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

export const routes: RouteDefinition[] = [
	//MO TODO / routes to /app, and redirects to /home if unauthorized
	{ path: "/", component: lazy(() => import("../pages/Home/Home")) },
	{ path: "/home", component: lazy(() => import("../pages/Home/Home")) },
	{ path: "**", component: lazy(() => import("../pages/404/404")) },
];
