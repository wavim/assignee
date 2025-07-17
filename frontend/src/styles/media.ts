export type MediaKey = keyof typeof queries;
export type MediaOpt = "on" | "off" | "system";

const queries = {
	darkmode: window.matchMedia("(prefers-color-scheme: dark)"),
	rdmotion: window.matchMedia("(prefers-reduced-motion)"),
};

export function getMedia(key: MediaKey): MediaOpt {
	return (localStorage.getItem(key) as MediaOpt | null) ?? "system";
}

export function resMedia(key: MediaKey): boolean {
	const option = getMedia(key);

	return option === "system" ? queries[key].matches : option === "on";
}

export function setMedia(key: MediaKey, option: MediaOpt): void {
	localStorage.setItem(key, option);
}
