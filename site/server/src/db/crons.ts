import { schedule } from "node-cron";
import { prisma } from "./client.ts";
import { configs } from "/configs/configs.ts";
import { subtime } from "/utils/time.ts";

export function init(): void {
  schedule(
    "0 * * * *",
    async () => {
      await prisma.session.deleteMany({
        where: { created: { lt: subtime(configs.sessionAge) } },
      });
    },
  );
}
