import { PostUsersSigninRequest, PostUsersSignupRequest } from "@app/schema";
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

	rateLim: Record<"users/signin" | "users/signup", Partial<RateLimOptions>>;
} = {
	sessRot: { h: 1 },
	sessAge: { d: 1 },
	codeAge: { d: 7 },

	hashSID: new HashID("SALT IN MCDONALDS"),
	hashTID: new HashID("SALT OF MCDONALDS"),
	hashAID: new HashID("SALT OF KFC FRIES"),

	rateLim: {
		"users/signin": {
			limit: 5,
			windowMs: ms({ m: 1 }),
			keyGenerator: (r) => PostUsersSigninRequest.safeParse(r.body).data?.mail ?? ip(r),
		},
		"users/signup": {
			limit: 5,
			windowMs: ms({ m: 1 }),
			keyGenerator: (r) => PostUsersSignupRequest.safeParse(r.body).data?.mail ?? ip(r),
		},
	},
};

const ip = (r: { ip?: string }) => ipKeyGenerator(r.ip ?? "::");
