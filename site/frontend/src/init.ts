import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ autoSleep: 60, nullTargetWarn: false });

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)");

prefersDarkScheme.onchange = () => location.reload();
prefersReducedMotion.onchange = () => location.reload();

const scheme =
	(localStorage.getItem("scheme") as "light" | "dark" | null) ??
	(prefersDarkScheme.matches ? "dark" : "light");
if (scheme === "dark") document.documentElement.classList.add("dark");

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
