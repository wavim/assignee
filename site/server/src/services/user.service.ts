import { zUserMembers } from "@app/schema";
import { prisma } from "../database/client";

export async function members(uid: number): Promise<zUserMembers> {
	return await prisma.member.findMany({
		select: { tid: true, auth: true, Team: { select: { name: true, desc: true } } },
		where: { uid },
	});
}
