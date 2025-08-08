import { Options as RateLimOpt } from "express-rate-limit";
import { ms, Time } from "../utils/time";

export const CONFIG: {
	SESS_AGE: Time;
	RATE_LIM: Record<"AUTH_SIGNER" | "AUTH_VERIFY" | "TEAM_CREATE", Partial<RateLimOpt>>;
} = {
	SESS_AGE: { d: 1 },
	RATE_LIM: {
		AUTH_SIGNER: { windowMs: ms({ m: 1 }), limit: 5 },
		AUTH_VERIFY: { windowMs: ms({ m: 1 }), limit: 5, skipSuccessfulRequests: true },
		TEAM_CREATE: { windowMs: ms({ d: 1 }), limit: 10 },
	},
};
