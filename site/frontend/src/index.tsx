import "./init";

import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import Loader from "./components/Loader/Loader";
import { routes } from "./data/routes";

//MO DEV clear browser storage
// localStorage.clear();
// sessionStorage.clear();

render(
	() => (
		<>
			<Loader
				pageLoad={
					new Promise((res) => {
						window.onload = () => res();
					})
				}
			></Loader>
			<Router>{routes}</Router>
		</>
	),
	document.getElementById("root")!,
);
