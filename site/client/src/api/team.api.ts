import { TeamCreated, zTeamCreated, zTeamDetails } from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api/team" });

export async function create(detail: zTeamDetails): Promise<zTeamCreated> {
	return await api.post("/create", detail).then(({ data }) => TeamCreated.parse(data));
}
