import compression from "compression";
import express from "express";
import path from "path";

import { prisma } from "prisma/client.prisma.js";

prisma.$connect();

const app = express()
	.use(compression())
	.use(express.static(path.join(__dirname, "../public")));

app.listen(5450, () => {
	console.log(
		`Assignee started on http://localhost:5450; Ctrl+C to terminate.`,
	);
});
