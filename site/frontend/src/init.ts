import "./effects/effects";
import "./styles/index.css";

import { loadGFont } from "gfont-loader";
import Lenis from "lenis";
import { Natlog } from "natural-log";

loadGFont({
	family: "Montserrat",
	axis: [
		//MO TODO see if i need italics
		{ ital: 0, wght: "100..900" },
		{ ital: 1, wght: "100..900" },
	],
});
new Lenis({ autoRaf: true, lerp: 0.05 });
new Natlog({ popup: import.meta.env.DEV });
