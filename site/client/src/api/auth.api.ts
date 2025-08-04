import { zAuthId } from "@app/schema";
import { api } from "./api";

export async function rotate(): Promise<boolean> {
	return await api.post("/rotate").then(
		() => true,
		() => false,
	);
}

// export async function signin({eml, pwd}:zAuthId): Promise<boolean> {
	
// }
