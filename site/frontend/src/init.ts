import "./styles/index.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { default as Lenis } from "lenis";

//MO DEV clear local storage
sessionStorage.clear();

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
gsap.ticker.lagSmoothing(0);
gsap.ticker.add((time) => {
	lenis.raf(time * 1000);
});
lenis.on("scroll", ScrollTrigger.update);

if (import.meta.env.DEV) {
	const natlog = await import("natural-log");
	new natlog.Natlog();
}
