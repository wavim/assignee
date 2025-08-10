import {
	InviterCode,
	TeamCreated,
	TeamPayload,
	zInviterCode,
	zTeamCreated,
	zTeamDetails,
	zTeamPayload,
} from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api/team" });

export async function create(detail: zTeamDetails): Promise<zTeamCreated> {
	return await api.post("/create", detail).then(({ data }) => TeamCreated.parse(data));
}

export async function invite(detail: zTeamCreated): Promise<zInviterCode> {
	return await api.post("/invite", detail).then(({ data }) => InviterCode.parse(data));
}

export async function access(detail: zInviterCode): Promise<zTeamPayload> {
	return await api.post("/access", detail).then(({ data }) => TeamPayload.parse(data));
}
