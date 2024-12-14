import { config } from "dotenv";
import { expand } from "dotenv-expand";

const dotenvConfig = config();
expand(dotenvConfig);

export const configs = {
	app: (await import("./app.config.js")).config,
	db: (await import("./db.config.js")).config,
};
