import { prisma } from "./client.prisma.js";

export namespace PrismaTypes {
	export type ExcludeMetaData<Input> = Omit<Input, "created" | "updated">;

	export type Models =
		| typeof prisma.user
		| typeof prisma.authcode
		| typeof prisma.password
		| typeof prisma.session
		| typeof prisma.preference
		| typeof prisma.team
		| typeof prisma.invitation
		| typeof prisma.membership
		| typeof prisma.appointment
		| typeof prisma.assignment
		| typeof prisma.assignmentAttachment
		| typeof prisma.submission
		| typeof prisma.submissionAttachment;
}
