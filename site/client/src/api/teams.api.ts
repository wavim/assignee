import {
	GetTeamsResults,
	GetTeamsTeamIdRequest,
	GetTeamsTeamIdResults,
	PostTeamsRequest,
	PostTeamsResults,
} from "@app/schema";
import axios from "axios";

const teams = axios.create({ baseURL: "/api/teams" });

export async function createTeam(req: PostTeamsRequest): Promise<PostTeamsResults> {
	return PostTeamsResults.parse((await teams.post("/", req)).data);
}

export async function queryTeams(): Promise<GetTeamsResults> {
	return GetTeamsResults.parse((await teams.get("/")).data);
}

export async function teamDetail(req: GetTeamsTeamIdRequest): Promise<GetTeamsTeamIdResults> {
	return GetTeamsTeamIdResults.parse((await teams.get("/" + req.tid)).data);
}
