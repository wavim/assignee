import { SigninRequest, SignupRequest } from "@app/schema";
import { ErrorCode } from "@wvm/http-error";
import axios from "axios";

const api = axios.create({ baseURL: "/api" });
type Okay = 204;

export async function verify(): Promise<boolean> {
	try {
		await api.post("/auth/verify");

		return true;
	} catch {
		return false;
	}
}

export async function logout(): Promise<boolean> {
	try {
		await api.post("/auth/logout");

		return true;
	} catch {
		return false;
	}
}

export async function signin(req: SigninRequest): Promise<Okay | ErrorCode> {
	const { status } = await api.post("/auth/signin", req, { validateStatus: () => true });

	return status;
}

export async function signup(req: SignupRequest): Promise<Okay | ErrorCode> {
	const { status } = await api.post("/auth/signup", req, { validateStatus: () => true });

	return status;
}
