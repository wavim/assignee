export function ease(ease: gsap.TweenVars): gsap.TweenVars {
	return resMedia("rdmotion") ? { ...ease, duration: 1e-6 } : ease;
}

export type MediaKey = keyof typeof queries;
export type MediaOpt = "os" | "on" | "no";

const queries = {
	darkmode: window.matchMedia("(prefers-color-scheme: dark)"),
	rdmotion: window.matchMedia("(prefers-reduced-motion)"),
};

queries.darkmode.addEventListener("change", () => {
	setMedia("darkmode");
});

queries.rdmotion.addEventListener("change", () => {
	setMedia("rdmotion");
	location.reload();
});

export function getMedia(key: MediaKey): MediaOpt {
	return (localStorage.getItem(key) as MediaOpt | null) ?? "os";
}

export function resMedia(key: MediaKey): boolean {
	const option = getMedia(key);

	return option === "os" ? queries[key].matches : option === "on";
}

export function setMedia(key: MediaKey, option: MediaOpt = getMedia(key)): void {
	localStorage.setItem(key, option);

	document.documentElement.classList.toggle(key, resMedia(key));
}
