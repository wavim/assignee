import { configs } from "configs.js";

import { createServer } from "https";
import { readFileSync } from "node:fs";

import express from "express";
import { prisma } from "prisma/client.prisma.js";

//MO DEV
import { AuthServices } from "services/user_services/auth.service.js";

import { routes } from "routes/routes.js";

//MO DEV
import { createInterface } from "node:readline";

prisma.$connect();

//MO DEV
await prisma.user.deleteMany({});

const key = readFileSync(`./${configs.app.sslcerts}/key.pem`, "utf-8");
const cert = readFileSync(`./${configs.app.sslcerts}/cert.pem`, "utf-8");
const passphrase = configs.app.sslpass;

const app = express();

app.use(express.static(`./${configs.app.static}`));
app.use("/api", routes);

const server = createServer({ key, cert, passphrase }, app);

server.listen(configs.app.port, () => {
	console.log(
		`Express started on https://localhost:${configs.app.port}; Ctrl+C to terminate.`,
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
