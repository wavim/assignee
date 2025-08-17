import {
	GetTaskRequest,
	GetTaskResults,
	GetTasksResults,
	GetTeamRequest,
	GetTeamTasksResults,
	GetUserTaskWorkRequest,
	PostTeamTaskRequest,
	PostTeamTaskResults,
	PutUserTaskCommRequest,
	PutWorkRequest,
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

export async function taskDetail(aid: GetTaskRequest): Promise<GetTaskResults> {
	return GetTaskResults.parse((await api.get(`/tasks/${aid.aid}`)).data);
}

export async function setWorkDone(aid: GetTaskRequest, req: PutWorkRequest): Promise<void> {
	await api.put(`/works/${aid.aid}`, req);
}

export async function setTaskFile(aid: GetTaskRequest, file: File): Promise<void> {
	await api.postForm(`/tasks/${aid.aid}/file`, { file });
}

export function getTaskFile(aid: GetTaskRequest): string {
	return `/api/tasks/${aid.aid}/file`;
}

export async function setWorkFile(aid: GetTaskRequest, file: File): Promise<void> {
	await api.postForm(`/works/${aid.aid}/file`, { file });
}

export function getWorkFile(aid: GetTaskRequest): string {
	return `/api/works/${aid.aid}/file`;
}

export async function setWorkComm(aid: GetTaskRequest, req: PutUserTaskCommRequest): Promise<void> {
	await api.put(`/works/${aid.aid}/comm`, req);
}

export function getUserWorkFile(aid: GetTaskRequest, req: GetUserTaskWorkRequest): string {
	return `/api/works/${aid.aid}/${req.mail}/file`;
}
