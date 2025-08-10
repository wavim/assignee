import { zTeamCreated, zTeamDetails } from "@app/schema";
import { prisma } from "../database/client";

export async function create(uid: number, { name, desc }: zTeamDetails): Promise<zTeamCreated> {
	return await prisma.team.create({
		select: { tid: true },
		data: {
			name,
			desc,

			Member: { create: { uid, auth: true } },
		},
	});
}
