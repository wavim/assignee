import {
	GetTasksResults,
	GetTeamRequest,
	GetTeamTasksResults,
	PostTeamTaskRequest,
	PostTeamTaskResults,
} from "@app/schema";
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export async function queryTasks(): Promise<GetTasksResults> {
	return GetTasksResults.parse((await api.get("/tasks")).data);
}

export async function createTask(
	tid: GetTeamRequest,
	req: PostTeamTaskRequest,
): Promise<PostTeamTaskResults> {
	return PostTeamTaskResults.parse((await api.post(`/teams/${tid.tid}/tasks`, req)).data);
}

export async function queryTeamTasks(tid: GetTeamRequest): Promise<GetTeamTasksResults> {
	return GetTeamTasksResults.parse((await api.get(`/teams/${tid.tid}/tasks`)).data);
}
