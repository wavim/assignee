import { prisma } from "prisma/client.prisma.js";

export namespace EmailService {
	export async function isEmailFree(email: string): Promise<boolean> {
		const found = await prisma.user.findUnique({
			where: { email },
			select: { uid: true },
		});
		return !found;
	}
}
