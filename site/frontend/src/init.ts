import "./styles/index.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { default as Lenis } from "lenis";

gsap.config({
	autoSleep: 60,
	//MO DEV unsuppress gsap null target warning
	// nullTargetWarn: false,
});

const lenis = new Lenis();

gsap.registerPlugin(ScrollTrigger);
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.lagSmoothing(0);
gsap.ticker.add((time) => {
	lenis.raf(time * 1000);
});

if (import.meta.env.DEV) {
	const natlog = await import("natural-log");
	new natlog.Natlog();
}
