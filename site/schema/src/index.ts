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

// GET /teams/:tid/code

export const GetTeamCodeResults = z.object({
	code: z.string().check(z.regex(/^[0-9a-f]{8}$/)),
});
export type GetTeamCodeResults = z.infer<typeof GetTeamCodeResults>;

// PUT /membs

export const PutMembRequest = z.object({
	code: z.string().check(z.trim(), z.regex(/^[0-9a-fA-F]{8}$/)),
});
export type PutMembRequest = z.infer<typeof PutMembRequest>;

export const PutMembResults = z.object({
	tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type PutMembResults = z.infer<typeof PutMembResults>;

// GET /tasks

export const GetTasksResults = z.array(
	z.object({
		aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
		tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
		name: z.string().check(z.trim(), z.minLength(1)),
		team: z.string().check(z.trim(), z.minLength(1)),
		dead: z.iso.datetime(),
		done: z.boolean(),
	}),
);
export type GetTasksResults = z.infer<typeof GetTasksResults>;

// POST /teams/:tid/tasks

export const PostTeamTaskRequest = z.object({
	name: z.string().check(z.trim(), z.minLength(1)),
	desc: z.string().check(z.trim(), z.minLength(1)),
	dead: z.iso.datetime().check(z.refine((d) => d > new Date().toISOString())),
});
export type PostTeamTaskRequest = z.infer<typeof PostTeamTaskRequest>;

export const PostTeamTaskResults = z.object({
	aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type PostTeamTaskResults = z.infer<typeof PostTeamTaskResults>;

// GET /teams/:tid/tasks

export const GetTeamTasksResults = z.discriminatedUnion("auth", [
	z.object({
		auth: z.literal(true),
		data: z.array(
			z.object({
				aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
				name: z.string().check(z.trim(), z.minLength(1)),
				dead: z.iso.datetime(),
				done: z.number().check(z.nonnegative()),
			}),
		),
	}),
	z.object({
		auth: z.literal(false),
		data: z.array(
			z.object({
				aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
				name: z.string().check(z.trim(), z.minLength(1)),
				dead: z.iso.datetime(),
				done: z.boolean(),
			}),
		),
	}),
]);
export type GetTeamTasksResults = z.infer<typeof GetTeamTasksResults>;
