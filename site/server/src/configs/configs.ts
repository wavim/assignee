import { Credentials } from "@app/schema";
import { Options as RateLimOpt } from "express-rate-limit";
import Hashids from "hashids";
import { ms, Time } from "../utils/time";

export const CONFIG: {
	SESS_ROT: Time;
	SESS_AGE: Time;
	CODE_AGE: Time;
	RATE_LIM: Record<
		"AUTH_AUTHEN" | "TEAM_CREATE" | "TEAM_INVITE" | "TEAM_ACCEPT",
		Partial<RateLimOpt>
	>;
	HASH_TID: Hashids;
} = {
	SESS_ROT: { h: 1 },
	SESS_AGE: { d: 1 },
	CODE_AGE: { d: 7 },
	RATE_LIM: {
		AUTH_AUTHEN: {
			keyGenerator: (r) => Credentials.parse(r.body).mail,
			windowMs: ms({ m: 1 }),
			limit: 5,
			skipSuccessfulRequests: true,
		},
		TEAM_CREATE: {
			keyGenerator: (r) => r.uid.toString(),
			windowMs: ms({ h: 1 }),
			limit: 10,
			skipFailedRequests: true,
		},
		TEAM_INVITE: {
			keyGenerator: (r) => r.tid.toString(),
			windowMs: ms({ h: 6 }),
			limit: 10,
			skipFailedRequests: true,
		},
		TEAM_ACCEPT: {
			keyGenerator: (r) => r.uid.toString(),
			windowMs: ms({ m: 1 }),
			limit: 10,
			skipFailedRequests: true,
		},
	},
	HASH_TID: new Hashids("SALT OF MCDONALDS", 8),
};
