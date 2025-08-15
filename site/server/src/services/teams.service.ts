// POST api/teams
// GET  api/teams
// GET  api/teams/:tid

import { GetTeamsResults, PostTeamsRequest, PostTeamsResults } from "@app/schema";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";

export async function createTeam(uid: number, req: PostTeamsRequest): Promise<PostTeamsResults> {
	const { tid } = await prisma.team.create({
		select: { tid: true },
		data: { ...req, Member: { create: { uid, auth: true } } },
	});

	return { tid: configs.hashTID.encode(tid) };
}

export async function queryTeams(uid: number): Promise<GetTeamsResults> {
	const membership = await prisma.member.findMany({
		select: { tid: true, auth: true, Team: { select: { name: true, desc: true } } },
		where: { uid },
	});

	return membership.map((m) => {
		return { tid: configs.hashTID.encode(m.tid), ...m.Team, auth: m.auth };
	});
}

// export async function details(tid: number, auth: boolean): Promise<zTeamDetails> {
// 	const details = await prisma.team.findUnique({
// 		select: {
// 			name: true,
// 			desc: true,
// 			Member: { select: { auth: true, User: { select: { name: true, mail: true } } } },
// 		},
// 		where: { tid },
// 	});

// 	if (!details) {
// 		throw new HttpError("NOT_FOUND", "Team Not Found");
// 	}

// 	return {
// 		auth,
// 		name: details.name,
// 		desc: details.desc,
// 		memb: details.Member.map((m) => {
// 			return { auth: m.auth, ...m.User };
// 		}),
// 	};
// }
