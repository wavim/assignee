import { zCredentials } from "@app/schema";
import { ErrorCode } from "@wvm/http-error";
import axios from "axios";

const api = axios.create({ baseURL: "/api/auth" });

export async function signin(creds: zCredentials): Promise<200 | ErrorCode> {
	return await api.post("/signin", creds, { validateStatus: () => true }).then((r) => r.status);
}

export async function signup(creds: zCredentials): Promise<200 | ErrorCode> {
	return await api.post("/signup", creds, { validateStatus: () => true }).then((r) => r.status);
}

export async function authen(): Promise<boolean> {
	return await api.post("/authen").then(
		() => true,
		() => false,
	);
}

export async function logout(): Promise<boolean> {
	return await api.post("/logout").then(
		() => true,
		() => false,
	);
}
