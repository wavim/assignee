import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { getFontSize, setFontSize } from "./configs/font-size";
import { getMedia, resMedia, setMedia } from "./configs/media";

export async function init(): Promise<void> {
	setFontSize(getFontSize());
	setMedia("darkmode", getMedia("darkmode"));

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
