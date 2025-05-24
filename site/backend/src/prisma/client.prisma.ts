import path from "path";

//MO DEV https://github.com/prisma/prisma/issues/27072 not yet fixed
// import { PrismaClient } from "generated/prisma/index.js";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
	prisma?: PrismaClient;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient(
		typeof (process as { pkg?: any }).pkg === "undefined"
			? undefined
			: {
					datasourceUrl: `file:${path.join(
						path.dirname(process.execPath),
						"./app.db",
					)}`,
			  },
	);

if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;
