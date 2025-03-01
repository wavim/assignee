import { configs } from "configs.js";

import express from "express";
import { prisma } from "prisma/client.prisma.js";

import { AuthServices } from "services/user_services/auth.service.js";
import { UserServices } from "services/user.service.js";

prisma.$connect();

//MO DEV
await prisma.user.deleteMany({});

const app = express();
app.set("port", configs.app.port);

app.use(express.static(`./${configs.app.static}`));
app.listen(app.get("port"), () => {
	console.log(`Express started on http://localhost:${app.get("port")}; Ctrl+C to terminate.`);
});
