import {
	GetTasksResults,
	GetTeamTasksResults,
	PostTeamTaskRequest,
	PostTeamTaskResults,
} from "@app/schema";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";

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
			tid: true,
			name: true,
			dead: true,
			Team: { select: { name: true } },
			Work: { select: { done: true }, where: { uid } },
		},
		where: { Team: { Member: { some: { uid, auth: false } } } },
	});

	return data.map((d) => ({
		aid: configs.hashAID.encode(d.aid),
		tid: configs.hashTID.encode(d.tid),
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
