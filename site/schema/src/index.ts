import * as z from "zod/mini";

// POST api/users/verify
// POST api/users/logout

export const UserSessionCookie = z.object({
	sid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
	key: z.string().check(z.regex(/^[0-9a-f]{64}$/)),
});
export type UserSessionCookie = z.infer<typeof UserSessionCookie>;

// POST api/users/signin

export const PostUsersSigninRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
	pass: z.string().check(z.regex(/^[\x20-\x7E]{8,}$/)),
});
export type PostUsersSigninRequest = z.infer<typeof PostUsersSigninRequest>;

// POST api/users/signup

export const PostUsersSignupRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
	pass: z.string().check(z.regex(/^[\x20-\x7E]{8,}$/)),
});
export type PostUsersSignupRequest = z.infer<typeof PostUsersSignupRequest>;

// POST api/teams

export const PostTeamsRequest = z.object({
	name: z.string().check(z.trim(), z.minLength(1)),
	desc: z.string().check(z.trim(), z.minLength(1)),
});
export type PostTeamsRequest = z.infer<typeof PostTeamsRequest>;

export const PostTeamsResults = z.object({
	tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type PostTeamsResults = z.infer<typeof PostTeamsResults>;

// GET api/teams

export const GetTeamsResults = z.array(
	z.object({
		tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
		name: z.string().check(z.trim(), z.minLength(1)),
		desc: z.string().check(z.trim(), z.minLength(1)),
		auth: z.boolean(),
	}),
);
export type GetTeamsResults = z.infer<typeof GetTeamsResults>;

// GET api/teams/:tid

export const GetTeamsTeamIdRequest = z.object({
	tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type GetTeamsTeamIdRequest = z.infer<typeof GetTeamsTeamIdRequest>;

export const GetTeamsTeamIdResults = z.object({
	name: z.string().check(z.trim(), z.minLength(1)),
	desc: z.string().check(z.trim(), z.minLength(1)),
	auth: z.boolean(),
	members: z.array(
		z.object({
			name: z.string().check(z.trim(), z.minLength(1)),
			mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
			auth: z.boolean(),
		}),
	),
});
export type GetTeamsTeamIdResults = z.infer<typeof GetTeamsTeamIdResults>;

// GET api/codes/:tid
// PUT api/codes
