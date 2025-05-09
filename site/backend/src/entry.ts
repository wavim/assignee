import compression from "compression";
import express from "express";
import { prisma } from "prisma/client.prisma.js";

import { configs } from "configs.js";
import { router } from "routes/routes.js";
import { AuthService } from "services/auth.service.js";

prisma.$connect();

//MO DEV clean db
// await prisma.user.deleteMany({});

const app = express();

app.use(compression());
app.use(express.static(`./${configs.app.static}`));
app.use("/api", router);

app.listen(configs.app.port, () => {
	console.log(
		`Express started on http://localhost:${configs.app.port}; Ctrl+C to terminate.`,
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
