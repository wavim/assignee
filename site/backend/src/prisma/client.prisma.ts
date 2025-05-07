import { PrismaClient } from "@prisma/client";

import { TableMetadataExtension } from "./extensions/metadata.extension.js";

const getPrisma = () => {
	const prisma = new PrismaClient();
	return prisma.$extends(TableMetadataExtension);
};

const globalForPrisma = global as unknown as {
	prisma?: ReturnType<typeof getPrisma>;
};

export const prisma = globalForPrisma.prisma ?? getPrisma();
globalForPrisma.prisma = prisma;
