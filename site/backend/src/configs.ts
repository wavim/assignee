import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

export const configs = {
	app: {
		port: getNumber("APP_PORT", 5500),
		static: getString("APP_STATIC", "public"),
	},
	auth: {
		sgSender: getString("SENDGRID_SENDER", "test@test.com"),
		sgApiKey: getString("SENDGRID_API_KEY", "abcd1234"),
		authcodeExpiryMin: getNumber("AUTHCODE_EXPIRY_MIN", 3),
		bearerTokenLen: getNumber("BEARER_TOKEN_LEN", 32),
	},
	valid: {
		minPasswordLen: getNumber("MIN_PASSWORD_LEN", 8),
	},
};

function getString(config: string, fallback: string): string {
	return process.env[config] ?? fallback;
}

function getNumber(config: string, fallback: number): number {
	const number = Number(process.env[config]);
	return Number.isNaN(number) ? fallback : number;
}
