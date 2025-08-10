import { UserMembers, zUserMembers } from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api/user" });

export async function members(): Promise<zUserMembers> {
	return await api.get("/members").then(({ data }) => UserMembers.parse(data));
}
