import { zInviteCode, zTeamBase, zTeamID, zTeamProfile } from "@app/schema";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { HttpError } from "@wavim/http-error";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";
import { NONE } from "../database/none";
import { decode, encode } from "../utils/hashid";
import { expired } from "../utils/time";

export async function create(uid: number, { name, desc }: zTeamProfile): Promise<zTeamID> {
	const { tid } = await prisma.team.create({
		select: { tid: true },
		data: { name, desc, Member: { create: { uid, auth: true } } },
	});

	return { hash: encode(tid) };
}

export async function invite(uid: number, { hash }: zTeamID): Promise<zInviteCode> {
	const tid = decode(hash);

	const member = await prisma.member.findUnique({
		select: { auth: true },
		where: { cpk: { uid, tid } },
	});

	if (!member) {
		throw new HttpError("UNAUTHORIZED", "No Team Membership");
	}

	if (!member.auth) {
		throw new HttpError("UNAUTHORIZED", "No Team Authorship");
	}

	let code;
	let attempt = 0;

	while (!code && attempt < 100) {
		code = randomBytes(4);
		attempt++;

		try {
			await prisma.invite.create({ select: { tid: NONE }, data: { tid, code } });
		} catch (e) {
			code = undefined;

			if (e instanceof PrismaClientKnownRequestError) {
				const invite = await prisma.invite.findUnique({
					select: { created: true },
					where: { tid },
				});

				if (!invite) {
					continue;
				}

				if (expired(invite.created, CONFIG.CODE_AGE)) {
					await prisma.invite.delete({ select: { tid: NONE }, where: { tid } });
					continue;
				}

				throw new HttpError("CONFLICT", "Has Active Code");
			}
			break;
		}
	}

	if (!code) {
		throw new HttpError("INTERNAL_SERVER_ERROR", "Crazy Dude");
	}

	return { code: bytesToHex(code).toUpperCase() };
}

export async function accept(uid: number, { code }: zInviteCode): Promise<zTeamBase> {
	const invite = await prisma.invite.findUnique({
		select: { tid: true, created: true },
		where: { code: hexToBytes(code) },
	});

	if (!invite) {
		throw new HttpError("UNAUTHORIZED", "Invalid Invitation Code");
	}
	const { tid, created } = invite;

	if (expired(created, CONFIG.CODE_AGE)) {
		throw new HttpError("UNAUTHORIZED", "Invitation Code Expired");
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

	return { hash: encode(tid), ...member.Team };
}
