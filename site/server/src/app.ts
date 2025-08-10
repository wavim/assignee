import compression from "compression";
import { lookup } from "dns/promises";
import express from "express";
import { hostname } from "os";
import { join } from "path";
import { prisma } from "./database/client";
import { init } from "./database/crons";
import { router } from "./routes/router";
import { $server } from "./utils/path";

async function main(): Promise<void> {
	await prisma.$connect();
	init();

	const app = express().use(compression());
	app.use("/api", router);

	const src = join($server, "public");
	const idx = join(src, "index.html");

	app.use(express.static(src)).get("/*CLIENT", (_, res) => {
		res.sendFile(idx);
	});

	const { address } = await lookup(hostname(), 4);
	app.listen(5450, "0.0.0.0", () => {
		console.log(`Assignee started on http://${address}:5450; Ctrl+C to terminate.`);
	});
}

void main();
