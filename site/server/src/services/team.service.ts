import { zTeamCreated, zTeamDetails } from "@app/schema";
import { CONFIG } from "../configs/configs";
import { prisma } from "../database/client";

export async function create(uid: number, { name, desc }: zTeamDetails): Promise<zTeamCreated> {
	const { tid } = await prisma.team.create({
		select: { tid: true },
		data: { name, desc, Member: { create: { uid, auth: true } } },
	});

	return { hash: CONFIG.HASH_IDS.encode(tid) };
}
