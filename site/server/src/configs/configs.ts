import { SigninRequest, SignupRequest } from "@app/schema";
import { ipKeyGenerator, Options as RateLimOptions } from "express-rate-limit";
import { HashID } from "../utils/hashid";
import { ms, Time } from "../utils/time";

export const configs: {
	sessRot: Time;
	sessAge: Time;
	codeAge: Time;

	hashSID: HashID;
	hashTID: HashID;
	hashAID: HashID;

	rateLim: Record<"auth/signin" | "auth/signup", Partial<RateLimOptions>>;
} = {
	sessRot: { h: 1 },
	sessAge: { d: 1 },
	codeAge: { d: 7 },

	hashSID: new HashID("SALT IN MCDONALDS"),
	hashTID: new HashID("SALT OF MCDONALDS"),
	hashAID: new HashID("SALT OF KFC FRIES"),

	rateLim: {
		"auth/signin": {
			limit: 5,
			windowMs: ms({ m: 1 }),
			keyGenerator: (r) => SigninRequest.safeParse(r.body).data?.mail ?? ip(r),
		},
		"auth/signup": {
			limit: 5,
			windowMs: ms({ m: 1 }),
			keyGenerator: (r) => SignupRequest.safeParse(r.body).data?.mail ?? ip(r),
		},
	},
};

const ip = (r: { ip?: string }) => ipKeyGenerator(r.ip ?? "::");
