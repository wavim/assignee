import {
	GetTaskResults,
	GetTasksResults,
	GetTeamTasksResults,
	GetUserTaskWorkRequest,
	PostTeamTaskRequest,
	PostTeamTaskResults,
	PutUserTaskCommRequest,
	PutWorkRequest,
} from "@app/schema";
import { HttpError } from "@wavim/http-error";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";
import { none } from "../database/none";

export async function createTask(
	tid: number,
	req: PostTeamTaskRequest,
): Promise<PostTeamTaskResults> {
	const { aid } = await prisma.task.create({ select: { aid: true }, data: { tid, ...req } });

	return { aid: configs.hashAID.encode(aid) };
}

export async function queryTasks(uid: number): Promise<GetTasksResults> {
	const data = await prisma.task.findMany({
		select: {
			aid: true,
			name: true,
			dead: true,
			Team: { select: { name: true } },
			Work: { select: { done: true }, where: { uid } },
		},
		where: { Team: { Member: { some: { uid, auth: false } } } },
	});

	return data.map((d) => ({
		aid: configs.hashAID.encode(d.aid),
		name: d.name,
		team: d.Team.name,
		dead: d.dead.toISOString(),
		done: d.Work[0]?.done ?? false,
	}));
}

export async function queryTeamTasks(
	uid: number,
	tid: number,
	own: boolean,
): Promise<GetTeamTasksResults> {
	if (own) {
		const query = await prisma.task.findMany({
			select: {
				aid: true,
				name: true,
				dead: true,
				_count: { select: { Work: { where: { done: true } } } },
			},
			where: { tid },
		});

		return {
			auth: true,
			data: query.map((d) => ({
				aid: configs.hashAID.encode(d.aid),
				name: d.name,
				dead: d.dead.toISOString(),
				done: d._count.Work,
			})),
		};
	}

	const query = await prisma.task.findMany({
		select: { aid: true, name: true, dead: true, Work: { select: { done: true }, where: { uid } } },
		where: { tid },
	});

	return {
		auth: false,
		data: query.map((d) => ({
			aid: configs.hashAID.encode(d.aid),
			name: d.name,
			dead: d.dead.toISOString(),
			done: d.Work[0]?.done ?? false,
		})),
	};
}

export async function taskDetail(
	uid: number,
	tid: number,
	aid: number,
	own: boolean,
): Promise<GetTaskResults> {
	const task = await prisma.task.findUniqueOrThrow({
		select: { name: true, desc: true, dead: true, TaskFile: { select: { name: true } } },
		where: { aid },
	});
	const { name, desc, dead, TaskFile } = task;

	if (own) {
		const query = await prisma.member.findMany({
			select: {
				User: {
					select: {
						name: true,
						mail: true,
						Work: {
							select: { done: true, comm: true, WorkFile: { select: { name: true } } },
							where: { aid },
						},
					},
				},
			},
			where: { tid, auth: false },
		});

		return {
			tid: configs.hashTID.encode(tid),
			auth: true,
			name,
			desc,
			dead: dead.toISOString(),
			file: TaskFile?.name,
			works: query.map(({ User: u }) => ({
				name: u.name,
				mail: u.mail,
				file: u.Work[0]?.WorkFile?.name,
				done: u.Work[0]?.done ?? false,
				comm: u.Work[0]?.comm ?? undefined,
			})),
		};
	}

	const { done, comm, WorkFile } = await prisma.work.upsert({
		select: { done: true, comm: true, WorkFile: { select: { name: true } } },
		update: {},
		create: { uid, aid },
		where: { uq: { uid, aid } },
	});

	return {
		tid: configs.hashTID.encode(tid),
		auth: false,
		name,
		desc,
		dead: dead.toISOString(),
		file: TaskFile?.name,
		work: { file: WorkFile?.name, done, comm: comm ?? undefined },
	};
}

export async function setTaskFile(
	aid: number,
	name: string,
	mime: string,
	blob: Buffer,
): Promise<void> {
	await prisma.taskFile.upsert({
		select: { aid: none },
		update: { name, mime, blob },
		create: { aid, name, mime, blob },
		where: { aid },
	});
}

export async function getTaskFile(
	aid: number,
): Promise<{ name: string; mime: string; blob: Uint8Array }> {
	const file = await prisma.taskFile.findUnique({
		select: { name: true, mime: true, blob: true },
		where: { aid },
	});

	if (!file) {
		throw new HttpError("NOT_FOUND", "File Not Found");
	}

	return file;
}

export async function setWorkDone(uid: number, aid: number, req: PutWorkRequest): Promise<void> {
	await prisma.work.update({ select: { sid: none }, data: req, where: { uq: { uid, aid } } });
}

export async function setWorkFile(
	uid: number,
	aid: number,
	name: string,
	mime: string,
	blob: Buffer,
): Promise<void> {
	await prisma.work.upsert({
		select: { sid: none },
		update: {
			WorkFile: { upsert: { update: { name, mime, blob }, create: { name, mime, blob } } },
		},
		create: { uid, aid, WorkFile: { create: { name, mime, blob } } },
		where: { uq: { uid, aid } },
	});
}

export async function getWorkFile(
	uid: number,
	aid: number,
): Promise<{ name: string; mime: string; blob: Uint8Array }> {
	const work = await prisma.work.findUnique({
		select: { WorkFile: { select: { name: true, mime: true, blob: true } } },
		where: { uq: { uid, aid } },
	});

	if (!work?.WorkFile) {
		throw new HttpError("NOT_FOUND", "Work Not Found");
	}

	return work.WorkFile;
}

export async function getUserWorkFile(
	aid: number,
	req: GetUserTaskWorkRequest,
): ReturnType<typeof getWorkFile> {
	const user = await prisma.user.findUnique({ select: { uid: true }, where: req });

	if (!user) {
		throw new HttpError("NOT_FOUND", "User Not Found");
	}

	return await getWorkFile(user.uid, aid);
}

export async function setWorkComm(aid: number, req: PutUserTaskCommRequest): Promise<void> {
	const user = await prisma.user.findUnique({ select: { uid: true }, where: { mail: req.mail } });

	if (!user) {
		throw new HttpError("NOT_FOUND", "User Not Found");
	}
	const { uid } = user;

	await prisma.work.update({
		select: { sid: none },
		data: { comm: req.comm ?? null },
		where: { uq: { uid, aid } },
	});
}
