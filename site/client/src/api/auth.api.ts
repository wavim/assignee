import { api } from "./api";

export async function authorized(): Promise<boolean> {
	return await api.post("/rotate").then(
		() => true,
		() => false,
	);
}
