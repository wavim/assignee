import "./init";
import "./styles/index.css";

import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { routes } from "./data/routes";

render(() => <Router>{routes}</Router>, document.getElementById("root")!);
