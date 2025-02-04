import { PrismaClient } from "@prisma/client";

import { useExtensionMetadata } from "./extensions/metadata.extension.js";

const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof useExtensionMetadata>;
};
export const prisma = globalForPrisma.prisma || useExtensionMetadata(new PrismaClient());
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
await prisma.$connect();
