import { PostUsersSigninRequest, PostUsersSignupRequest } from "@app/schema";
import { ErrorCode } from "@wvm/http-error";
import axios from "axios";

const users = axios.create({ baseURL: "/api/users" });

export async function verify(): Promise<boolean> {
	try {
		await users.post("/verify");

		return true;
	} catch {
		return false;
	}
}

export async function logout(): Promise<boolean> {
	try {
		await users.post("/logout");

		return true;
	} catch {
		return false;
	}
}

export async function signin(req: PostUsersSigninRequest): Promise<200 | ErrorCode> {
	const { status } = await users.post("/signin", req, { validateStatus: () => true });

	return status;
}

export async function signup(req: PostUsersSignupRequest): Promise<200 | ErrorCode> {
	const { status } = await users.post("/signup", req, { validateStatus: () => true });

	return status;
}
