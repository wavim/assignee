import { join } from "path";
import { PrismaClient } from "../prisma/client";
import { $server } from "../utils/path";

if (Object.hasOwn(process, "pkg")) {
	process.env.PRISMA_QUERY_ENGINE_LIBRARY = join($server, "out", "prisma.node");
}

export const prisma = new PrismaClient({ datasourceUrl: `file:${join(process.cwd(), "app.db")}` });
