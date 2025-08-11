import { Membership, zMembership } from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api/user" });

export async function membership(): Promise<zMembership> {
	return await api.get("/membership").then(({ data }) => Membership.parse(data));
}
