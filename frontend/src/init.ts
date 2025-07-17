import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { resMedia } from "./styles/media";

export async function init(): Promise<void> {
	gsap.registerPlugin(ScrollTrigger);

	if (!resMedia("rdmotion")) {
		const { default: Lenis } = await import("lenis");

		const lenis = new Lenis();

		gsap.ticker.add((t) => {
			lenis.raf(t * 1000);
		});
		gsap.ticker.lagSmoothing(0);

		lenis.on("scroll", () => {
			ScrollTrigger.update();
		});
	}

	if (import.meta.env.DEV) {
		const { natlog } = await import("natural-log");

		natlog({ prompts: ["log"] });
	}
}
