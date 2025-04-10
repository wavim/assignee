import "./data/effects";
import "./styles/index.css";

import { loadGFont } from "gfont-loader";
import Lenis from "lenis";
import { Natlog } from "natural-log";

loadGFont({ family: "Montserrat", axis: { ital: "1", wght: "100..900" } });
new Lenis({ autoRaf: true });
new Natlog({ popup: import.meta.env.DEV });
