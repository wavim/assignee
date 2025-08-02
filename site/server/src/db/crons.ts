import { schedule } from "node-cron";
import { prisma } from "./client.ts";
import { config } from "/config/config.ts";
import { subtime } from "/utils/time.ts";

export function crons(): void {
  schedule(
    "0 * * * *",
    async () => {
      await prisma.session.deleteMany({
        where: { created: { lt: subtime(config.sessionAge) } },
      });
    },
  );
}
