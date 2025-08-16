import {
	GetTeamsResults,
	GetTeamsTeamIdResults,
	PostTeamsRequest,
	PostTeamsResults,
} from "@app/schema";
import { HttpError } from "@wavim/http-error";
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

export async function teamDetail(tid: number, own: boolean): Promise<GetTeamsTeamIdResults> {
	const data = await prisma.team.findUnique({
		select: {
			name: true,
			desc: true,
			Member: { select: { auth: true, User: { select: { name: true, mail: true } } } },
		},
		where: { tid },
	});

	if (!data) {
		throw new HttpError("NOT_FOUND", "Team Not Found");
	}

	return {
		name: data.name,
		desc: data.desc,
		auth: own,
		members: data.Member.map((m) => {
			return { ...m.User, auth: m.auth };
		}),
	};
}
