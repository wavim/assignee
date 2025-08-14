import {
	zInviteCode,
	zMembership,
	zTeamBase,
	zTeamDetails,
	zTeamID,
	zTeamProfile,
} from "@app/schema";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";
import { HttpError } from "@wavim/http-error";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";
import { NONE } from "../database/none";
import { encode } from "../utils/hashid";
import { expired } from "../utils/time";

export async function create(uid: number, profile: zTeamProfile): Promise<zTeamID> {
	const { tid } = await prisma.team.create({
		select: { tid: true },
		data: { ...profile, Member: { create: { uid, auth: true } } },
	});

	return { hash: encode(CONFIG.HASH_TID, tid) };
}

export async function invite(tid: number): Promise<zInviteCode> {
	const invite = await prisma.invite.findUnique({
		select: { code: true, created: true },
		where: { tid },
	});

	if (invite) {
		const { code, created } = invite;

		if (expired(created, CONFIG.CODE_AGE)) {
			await prisma.invite.delete({ select: { tid: NONE }, where: { tid } });
		} else {
			return { code: bytesToHex(code) };
		}
	}

	for (let attempt = 0; attempt < 10; attempt++) {
		const code = randomBytes(4);

		try {
			await prisma.invite.create({ select: { tid: NONE }, data: { tid, code } });
		} catch {
			continue;
		}

		return { code: bytesToHex(code) };
	}

	throw new HttpError("INTERNAL_SERVER_ERROR", "Crazy Dude");
}

export async function accept(uid: number, { code }: zInviteCode): Promise<zTeamBase> {
	const invite = await prisma.invite.findUnique({
		select: { tid: true, created: true },
		where: { code: hexToBytes(code) },
	});

	if (!invite) {
		throw new HttpError("FORBIDDEN", "Invalid Invitation Code");
	}
	const { tid, created } = invite;

	if (expired(created, CONFIG.CODE_AGE)) {
		throw new HttpError("FORBIDDEN", "Invitation Code Expired");
	}

	let member;
	try {
		member = await prisma.member.create({
			select: { Team: { select: { name: true, desc: true } } },
			data: { uid, tid, auth: false },
		});
	} catch {
		throw new HttpError("CONFLICT", "Already Team Member");
	}

	return { hash: encode(CONFIG.HASH_TID, tid), ...member.Team };
}

export async function members(uid: number): Promise<zMembership> {
	const membs = await prisma.member.findMany({
		select: { tid: true, auth: true, Team: { select: { name: true, desc: true } } },
		where: { uid },
	});

	return membs.map((m) => {
		return { auth: m.auth, hash: encode(CONFIG.HASH_TID, m.tid), ...m.Team };
	});
}

export async function details(tid: number, auth: boolean): Promise<zTeamDetails> {
	const details = await prisma.team.findUnique({
		select: {
			name: true,
			desc: true,
			Member: { select: { auth: true, User: { select: { name: true, mail: true } } } },
		},
		where: { tid },
	});

	if (!details) {
		throw new HttpError("NOT_FOUND", "Team Not Found");
	}

	return {
		auth,
		name: details.name,
		desc: details.desc,
		memb: details.Member.map((m) => {
			return { auth: m.auth, ...m.User };
		}),
	};
}
