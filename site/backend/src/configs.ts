import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

export const configs = {
	app: {
		port: Number(process.env.APP_PORT) ?? 3000,
		static: process.env.APP_STATIC ?? "public",
	},
	auth: {
		sgSender: process.env.SENDGRID_SENDER ?? "test@outlook.com",
		sgApiKey: process.env.SENDGRID_API_KEY ?? "1234",
		authcodeExpiry: Number(process.env.AUTHCODE_EXPIRY) ?? 3,
	},
};
