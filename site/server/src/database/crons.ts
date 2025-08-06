import { schedule } from "node-cron";
import { configs } from "../configs/configs";
import { subtime } from "../utils/time";
import { prisma } from "./client";

export function init(): void {
	schedule("0 * * * *", async () => {
		await prisma.session.deleteMany({
			where: { created: { lt: subtime(configs.sessionAge) } },
		});
	});
}
