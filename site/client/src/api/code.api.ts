import { GetTeamCodeResults, GetTeamRequest, PutMembRequest, PutMembResults } from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export async function getCode(req: GetTeamRequest): Promise<GetTeamCodeResults> {
	return GetTeamCodeResults.parse((await api.get(`/teams/${req.tid}/code`)).data);
}

export async function putMemb(req: PutMembRequest): Promise<PutMembResults> {
	return PutMembResults.parse((await api.put("/membs", req)).data);
}
