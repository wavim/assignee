import { zUserMembers } from "@app/schema";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";

export async function members(uid: number): Promise<zUserMembers> {
	const data = await prisma.member.findMany({
		select: { tid: true, auth: true, Team: { select: { name: true, desc: true } } },
		where: { uid },
	});

	return data.map((m) => {
		return { auth: m.auth, hash: CONFIG.HASH_IDS.encode(m.tid), ...m.Team };
	});
}
