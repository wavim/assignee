export type FontSize = "sm" | "md" | "lg";

export function getFontSize(): FontSize {
	return (localStorage.getItem("fontsize") as FontSize | null) ?? "md";
}

export function setFontSize(option: FontSize): void {
	localStorage.setItem("fontsize", option);

	document.documentElement.style.fontSize = { sm: "85%", md: "100%", lg: "115%" }[option];
}
