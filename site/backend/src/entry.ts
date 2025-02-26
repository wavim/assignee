import express from "express";

import { configs } from "configs.js";
import { prisma } from "prisma/client.prisma.js";
import { AuthServices } from "services/auth.services.js";
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
