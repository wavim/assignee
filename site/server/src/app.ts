import compression from "compression";
import express from "express";
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

	app.listen(5450, () => {
		console.log("Assignee started on http://localhost:5450; Ctrl+C to terminate.");
	});
}

void main();
