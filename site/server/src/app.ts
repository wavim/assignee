import compression from "compression";
import express from "express";
import { networkInterfaces } from "os";
import { join } from "path";
import { prisma } from "./database/client";
import { init } from "./database/crons";
import { route } from "./routes/route";
import { $server } from "./utils/path";

async function main(): Promise<void> {
	await prisma.$connect();
	init();

	const app = express().disable("x-powered-by");
	app.use(compression());
	app.use("/api", route);

	const src = join($server, "public");
	const idx = join(src, "index.html");

	app.use(express.static(src, { immutable: true, maxAge: "1y" })).get("/*CLIENT", (_, res) => {
		res.sendFile(idx);
	});

	const lan = Object.values(networkInterfaces())
		.flat()
		.find((v) => v?.family === "IPv4" && !v.internal)?.address;

	app.listen(5450, "0.0.0.0", () => {
		console.log(`Assignee started on http://${lan ?? "localhost"}:5450; Ctrl+C to terminate.`);
	});
}

void main();
