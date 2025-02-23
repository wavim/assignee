import { prisma } from "prisma/client.prisma.js";
import { AuthServices } from "./auth.services.js";

export namespace UserServices {
	export async function isEmailAvailable(email: string): Promise<boolean> {
		const found = prisma.user.findUnique({
			where: { email },
		});
		return Boolean(found);
	}

	export async function registerUser(data: { email: string; name: string; password: string }): Promise<void> {
		const authenticated = await AuthServices.authUserRegister(data.email);
		if (!authenticated) {
			throw new Error(`User registration for ${JSON.stringify(data)} is not authenticated.`);
		}

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
	}

	// export async function updateUser(uid: bigint, data: Prisma.UserUpdateInput) {
	// 	await prisma.user.update({
	// 		data,
	// 		where: {
	// 			uid,
	// 		},
	// 	});
	// }
}
