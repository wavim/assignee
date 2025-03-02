import { configs } from "configs.js";

import express from "express";
import { prisma } from "prisma/client.prisma.js";

import { AuthServices } from "services/user_services/auth.service.js";

import { routes } from "routes/routes.js";

//MO DEV
import { createInterface } from "node:readline";

prisma.$connect();

//MO DEV
await prisma.user.deleteMany({});

const app = express();
app.set("port", configs.app.port);
app.use("/api", routes);
app.use(express.static(`./${configs.app.static}`));
app.listen(app.get("port"), () => {
	console.log(
		`Express started on http://localhost:${app.get(
			"port",
		)}; Ctrl+C to terminate.`,
	);
});

//MO TEST
const t = await AuthServices.registerUser({
	email: "assignee.tester@gmail.com",
	name: "Tester",
	password: "Test12345",
	browser: {
		name: "Microsoft Edge",
		os: "Windows",
		platform: "desktop",
		engine: "Blink",
	},
});
console.log(JSON.stringify(t));
