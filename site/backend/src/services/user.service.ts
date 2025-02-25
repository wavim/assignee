import { prisma } from "prisma/client.prisma.js";
import { AuthServices } from "./auth.services.js";

export namespace UserServices {
	export async function isEmailAvailable(email: string): Promise<boolean> {
		const found = await prisma.user.findUnique({
			where: { email },
		});
		return !found;
	}

	export async function registerUser(data: { email: string; password: string; name: string }): Promise<void> {
		const user = await prisma.user.create({
			data: { email: data.email, name: data.name, created: 0, updated: 0 },
		});

		const { hash, salt } = AuthServices.hash(data.password);

		await prisma.password.create({
			data: {
				uid: user.uid,
				hash,
				salt,
				updated: 0,
			},
		});

		await prisma.preference.create({
			data: {
				uid: user.uid,
				override: {},
				updated: 0,
			},
		});
	}
}
