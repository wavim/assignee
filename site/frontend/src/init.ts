import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ autoSleep: 60, nullTargetWarn: false });

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)");
prefersReducedMotion.onchange = () => location.reload();

if (!prefersReducedMotion.matches) {
	const lenis = new (await import("lenis")).default();

	gsap.ticker.lagSmoothing(0);
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});

	lenis.on("scroll", ScrollTrigger.update);
}

if (import.meta.env.DEV) {
	const natlog = await import("natural-log");
	new natlog.Natlog();
}
