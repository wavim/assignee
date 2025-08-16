import {
	GetTeamRequest,
	GetTeamResults,
	GetTeamsResults,
	PostTeamRequest,
	PostTeamResults,
} from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export async function createTeam(req: PostTeamRequest): Promise<PostTeamResults> {
	return PostTeamResults.parse((await api.post("/teams", req)).data);
}

export async function queryTeams(): Promise<GetTeamsResults> {
	return GetTeamsResults.parse((await api.get("/teams")).data);
}

export async function teamDetail(req: GetTeamRequest): Promise<GetTeamResults> {
	return GetTeamResults.parse((await api.get(`/teams/${req.tid}`)).data);
}
