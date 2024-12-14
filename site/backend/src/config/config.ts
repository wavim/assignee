import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export const config = {
	app: (await import("./app.config.js")).config,
	db: (await import("./db.config.js")).config,
};
