import * as z from "zod/mini";

// POST /auth/verify
// POST /auth/logout

export const SessionCookie = z.object({
	sid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
	key: z.string().check(z.regex(/^[0-9a-f]{64}$/)),
});
export type SessionCookie = z.infer<typeof SessionCookie>;

// POST /auth/signin

export const SigninRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
	pass: z.string().check(z.regex(/^[\x20-\x7E]{8,}$/)),
});
export type SigninRequest = z.infer<typeof SigninRequest>;

// POST /auth/signup

export const SignupRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
	pass: z.string().check(z.regex(/^[\x20-\x7E]{8,}$/)),
});
export type SignupRequest = z.infer<typeof SignupRequest>;
