import { zMembership } from "@app/schema";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";
import { encode } from "../utils/hashid";

export async function membership(uid: number): Promise<zMembership> {
	const membs = await prisma.member.findMany({
		select: { tid: true, auth: true, Team: { select: { name: true, desc: true } } },
		where: { uid },
	});

	return membs.map((m) => {
		return { auth: m.auth, hash: encode(CONFIG.HASH_TID, m.tid), ...m.Team };
	});
}
