import { zUserMembers } from "@app/schema";
import { prisma } from "../database/client";
import { encode } from "../utils/hashid";

export async function members(uid: number): Promise<zUserMembers> {
	const data = await prisma.member.findMany({
		select: { tid: true, auth: true, Team: { select: { name: true, desc: true } } },
		where: { uid },
	});

	return data.map((m) => {
		return { auth: m.auth, hash: encode(m.tid), ...m.Team };
	});
}
