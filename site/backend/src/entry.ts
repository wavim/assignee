import { configs } from "configs.js";
import express from "express";
import { createServer } from "https";
import { readFileSync } from "node:fs";
import { prisma } from "prisma/client.prisma.js";
import { router } from "routes/routes.js";
import { AuthService } from "services/auth.service.js";

prisma.$connect();

//MO DEV clean db
// await prisma.user.deleteMany({});

const key = readFileSync(`./${configs.app.sslcerts}/key.pem`, "utf-8");
const cert = readFileSync(`./${configs.app.sslcerts}/cert.pem`, "utf-8");
const passphrase = configs.app.sslpass;

const app = express();

app.use(express.static(`./${configs.app.static}`));
app.use("/api", router);

const server = createServer({ key, cert, passphrase }, app);

//MO TODO ssl expired
server.listen(configs.app.port, () => {
	console.log(
		`Express started on https://localhost:${configs.app.port}; Ctrl+C to terminate.`,
	);
});

//MO TEST register user
// const t = await AuthServices.registerUser({
// 	email: "assignee.tester@gmail.com",
// 	name: "Tester",
// 	password: "Test12345",
// 	browser: {
// 		name: "Microsoft Edge",
// 		os: "Windows",
// 		platform: "desktop",
// 		engine: "Blink",
// 	},
// });
// console.log(JSON.stringify(t));
