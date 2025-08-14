import {
	InviteCode,
	Membership,
	TeamBase,
	TeamDetails,
	TeamID,
	zInviteCode,
	zMembership,
	zTeamBase,
	zTeamDetails,
	zTeamID,
	zTeamProfile,
} from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api/team" });

export async function create(data: zTeamProfile): Promise<zTeamID> {
	return await api.post("/create", data).then(({ data }) => TeamID.parse(data));
}

export async function invite(data: zTeamID): Promise<zInviteCode> {
	return await api.post("/invite", data).then(({ data }) => InviteCode.parse(data));
}

export async function accept(data: zInviteCode): Promise<zTeamBase> {
	return await api.post("/accept", data).then(({ data }) => TeamBase.parse(data));
}

export async function members(): Promise<zMembership> {
	return await api.get("/members").then(({ data }) => Membership.parse(data));
}

export async function details(params: zTeamID): Promise<zTeamDetails> {
	return await api.get("/details", { params }).then(({ data }) => TeamDetails.parse(data));
}
