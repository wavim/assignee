export const reveal = () => {
	if (sessionStorage.getItem("debut") !== "false") {
		return new Promise<void>((res) => {
			window.addEventListener(":reveal", () => res(), { once: true });
		});
	}
};
