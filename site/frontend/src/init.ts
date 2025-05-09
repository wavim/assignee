import "./accessibility/media";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

import { media } from "./accessibility/media";

gsap.config({ autoSleep: 60, nullTargetWarn: false });

gsap.registerPlugin(ScrollTrigger);

if (media.getReduceMotion("eval") === "off") {
	const lenis = new (await import("lenis")).default();

	lenis.on("scroll", ScrollTrigger.update);

	gsap.ticker.add((time) => lenis.raf(time * 1000));

	gsap.ticker.lagSmoothing(0);
}

if (import.meta.env.DEV) new (await import("natural-log")).Natlog();
