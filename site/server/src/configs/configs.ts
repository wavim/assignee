import { Options as RateLimOpt } from "express-rate-limit";
import Hashids from "hashids";
import { ms, Time } from "../utils/time";

export const CONFIG: {
	SESS_AGE: Time;
	CODE_AGE: Time;
	RATE_LIM: Record<
		"AUTH_SIGNER" | "AUTH_VERIFY" | "TEAM_CREATE" | "TEAM_INVITE" | "TEAM_ACCESS",
		Partial<RateLimOpt>
	>;
	HASH_IDS: Hashids;
} = {
	SESS_AGE: { d: 1 },
	CODE_AGE: { d: 7 },
	RATE_LIM: {
		AUTH_SIGNER: { windowMs: ms({ m: 1 }), limit: 5 },
		AUTH_VERIFY: { windowMs: ms({ m: 1 }), limit: 5, skipSuccessfulRequests: true },
		TEAM_CREATE: { windowMs: ms({ d: 1 }), limit: 10 },
		TEAM_INVITE: { windowMs: ms({ d: 1 }), limit: 20 },
		TEAM_ACCESS: { windowMs: ms({ m: 1 }), limit: 5, skipSuccessfulRequests: true },
	},
	HASH_IDS: new Hashids("SALT OF MCDONALDS", 8),
};
