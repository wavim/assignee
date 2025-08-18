import * as z from "zod/mini";

// POST /teams

export const PostTeamRequest = z.object({
	name: z.string().check(z.trim(), z.minLength(1)),
	desc: z.string().check(z.trim(), z.minLength(1)),
});
export type PostTeamRequest = z.infer<typeof PostTeamRequest>;

export const PostTeamResults = z.object({
	tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type PostTeamResults = z.infer<typeof PostTeamResults>;

// GET /teams

export const GetTeamsResults = z.array(
	z.object({
		tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
		name: z.string().check(z.trim(), z.minLength(1)),
		desc: z.string().check(z.trim(), z.minLength(1)),
		auth: z.boolean(),
	}),
);
export type GetTeamsResults = z.infer<typeof GetTeamsResults>;

// GET /teams/:tid

export const GetTeamRequest = z.object({
	tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type GetTeamRequest = z.infer<typeof GetTeamRequest>;

export const GetTeamResults = z.object({
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
export type GetTeamResults = z.infer<typeof GetTeamResults>;
