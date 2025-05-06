import "./styles/index.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { default as Lenis } from "lenis";
import { Natlog } from "natural-log";

//MO DEV clear local storage
sessionStorage.clear();

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
gsap.ticker.lagSmoothing(0);
gsap.ticker.add((time) => {
	lenis.raf(time * 1000);
});
lenis.on("scroll", ScrollTrigger.update);

//MO DEV natlog always on
new Natlog({ popup: import.meta.env.DEV || true });
