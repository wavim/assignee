import {
	GetCodesTeamIdResults,
	GetTeamsTeamIdRequest,
	PutCodesRequest,
	PutCodesResults,
} from "@app/schema";
import axios from "axios";

const codes = axios.create({ baseURL: "/api/codes" });

export async function getCode(req: GetTeamsTeamIdRequest): Promise<GetCodesTeamIdResults> {
	return GetCodesTeamIdResults.parse((await codes.get("/" + req.tid)).data);
}

export async function putCode(req: PutCodesRequest): Promise<PutCodesResults> {
	return PutCodesResults.parse((await codes.put("/", req)).data);
}
