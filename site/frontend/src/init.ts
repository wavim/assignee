import "./effects/effects";
import "./styles/index.css";

import { loadGFont } from "gfont-loader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import { Natlog } from "natural-log";

// already preconnected by omnires (natlog)
// preconnect();
loadGFont({
	family: "Montserrat",
	axis: [
		//MO TODO see if i need italics
		{ ital: 0, wght: "100..900" },
		{ ital: 1, wght: "100..900" },
	],
});

const lenis = new Lenis();
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);
gsap.ticker.add((time) => {
	lenis.raf(time * 1000);
});
lenis.on("scroll", ScrollTrigger.update);

new Natlog({ popup: import.meta.env.DEV });
