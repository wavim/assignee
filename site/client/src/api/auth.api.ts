import { zAuthId } from "@app/schema";
import { ErrorCode } from "@wvm/http-error";
import { api } from "./api";

export async function rotate(): Promise<boolean> {
	return await api.post("/rotate").then(
		() => true,
		() => false,
	);
}

export async function signin(data: zAuthId): Promise<200 | ErrorCode> {
	return await api
		.post("/signin", data, { validateStatus: () => true })
		.then((r) => r.status);
}

export async function signup(data: zAuthId): Promise<200 | ErrorCode> {
	return await api
		.post("/signup", data, { validateStatus: () => true })
		.then((r) => r.status);
}
