import { join } from "jsr:@std/path";
import { PrismaClient } from "../prisma/client.ts";

export const prisma = new PrismaClient({
  datasourceUrl: `file:${join(Deno.cwd(), "app.db")}`,
});
