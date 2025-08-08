import { schedule } from "node-cron";
import { CONFIG } from "../configs/configs";
import { subtime } from "../utils/time";
import { prisma } from "./client";

export function init(): void {
	schedule("0 * * * *", async () => {
		await prisma.sess.deleteMany({ where: { created: { lt: subtime(CONFIG.SESS_AGE) } } });
	});
}
