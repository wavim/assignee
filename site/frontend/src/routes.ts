import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: lazy(() => import("./pages/Home/Home")),
	},
	{
		path: "**",
		component: lazy(() => import("./pages/404/404")),
	},
];
