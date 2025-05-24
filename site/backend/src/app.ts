import compression from "compression";
import express from "express";
import path from "path";

import { prisma } from "prisma/client.prisma.js";
// import { router } from "routes/routes.js";

prisma.$connect();

const app = express()
	.use(compression())
	.use(express.static(path.join(__dirname, "../public")));
// .use("/api", router);

app.listen(5450, () => {
	console.log(
		`Assignee started on http://localhost:5450; Ctrl+C to terminate.`,
	);
});
