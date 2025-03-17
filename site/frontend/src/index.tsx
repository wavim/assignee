import "locomotive-scroll/locomotive-scroll.css";
import "./index.css";

import { Router } from "@solidjs/router";
import { Natlog } from "natural-log";
import { render } from "solid-js/web";
import { Locomotive } from "./libs";

import { routes } from "./routes";

import "./effects";

import Loader from "./components/Loader/Loader";

new Natlog();
new Locomotive();

const loadPromise = new Promise<void>((res) => {
	window.onload = () => res();
});

render(
	() => (
		<>
			<Loader loadPromise={loadPromise}></Loader>
			<Router>{routes}</Router>
		</>
	),
	document.getElementById("root")!,
);
