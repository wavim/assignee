import "locomotive-scroll/locomotive-scroll.css";
import "./index.css";

import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { Locomotive } from "./libs";

import { routes } from "./routes";

new Locomotive();

render(() => <Router>{routes}</Router>, document.getElementById("root")!);
