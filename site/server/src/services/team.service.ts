import { zTeamCreated, zTeamDetails } from "@app/schema";
import { prisma } from "../database/client";

export async function create({ name, desc }: zTeamDetails, uid: number): Promise<zTeamCreated> {
	return await prisma.team.create({
		select: { tid: true },
		data: {
			name,
			desc,

			Member: { create: { uid, auth: true } },
		},
	});
}
