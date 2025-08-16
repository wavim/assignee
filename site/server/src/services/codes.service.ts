import { GetCodesTeamIdResults, PutCodesRequest, PutCodesResults } from "@app/schema";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";
import { HttpError } from "@wavim/http-error";
import { configs } from "../configs/configs";
import { prisma } from "../database/client";
import { none } from "../database/none";
import { expired } from "../utils/time";

export async function getCode(tid: number): Promise<GetCodesTeamIdResults> {
	const invitation = await prisma.invite.findUnique({
		select: { code: true, updated: true },
		where: { tid },
	});

	if (invitation) {
		const { code, updated } = invitation;

		if (expired(updated, configs.codeAge)) {
			await prisma.invite.delete({ select: { tid: none }, where: { tid } });
		} else {
			return { code: bytesToHex(code) };
		}
	}

	for (let attempt = 0; attempt < 10; attempt++) {
		const code = randomBytes(4);

		try {
			await prisma.invite.create({ select: { tid: none }, data: { tid, code } });
		} catch {
			continue;
		}

		return { code: bytesToHex(code) };
	}

	throw new HttpError("INTERNAL_SERVER_ERROR", "Crazy Dude");
}

export async function putCode(uid: number, req: PutCodesRequest): Promise<PutCodesResults> {
	const invitation = await prisma.invite.findUnique({
		select: { tid: true, updated: true },
		where: { code: hexToBytes(req.code) },
	});

	if (!invitation) {
		throw new HttpError("FORBIDDEN", "Invalid Invite Code");
	}
	const { tid, updated } = invitation;

	if (expired(updated, configs.codeAge)) {
		throw new HttpError("FORBIDDEN", "Invite Code Expired");
	}

	await prisma.member.upsert({
		select: { uid: none },
		update: {},
		create: { uid, tid, auth: false },
		where: { pk: { uid, tid } },
	});

	return { tid: configs.hashTID.encode(tid) };
}
