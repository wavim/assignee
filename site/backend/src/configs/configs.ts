import { config } from "dotenv";
import { expand } from "dotenv-expand";

const dotenvConfig = config();
expand(dotenvConfig);

export const configs = {
	port: process.env.APP_PORT ?? "5450",
	static: process.env.APP_STATIC ?? "public",
};
