import * as z from "zod/mini";

// POST /users/verify
// POST /users/logout

export const UserSessionCookie = z.object({
	sid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
	key: z.string().check(z.regex(/^[0-9a-f]{64}$/)),
});
export type UserSessionCookie = z.infer<typeof UserSessionCookie>;

// POST /users/signin

export const PostUsersSigninRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
	pass: z.string().check(z.regex(/^[\x20-\x7E]{8,}$/)),
});
export type PostUsersSigninRequest = z.infer<typeof PostUsersSigninRequest>;

// POST /users/signup

export const PostUsersSignupRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
	pass: z.string().check(z.regex(/^[\x20-\x7E]{8,}$/)),
});
export type PostUsersSignupRequest = z.infer<typeof PostUsersSignupRequest>;

// POST /teams

export const PostTeamsRequest = z.object({
	name: z.string().check(z.trim(), z.minLength(1)),
	desc: z.string().check(z.trim(), z.minLength(1)),
});
export type PostTeamsRequest = z.infer<typeof PostTeamsRequest>;

export const PostTeamsResults = z.object({
	tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type PostTeamsResults = z.infer<typeof PostTeamsResults>;

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

// GET /codes/:tid

export const GetCodesTeamIdResults = z.object({
	code: z.string().check(z.regex(/^[0-9a-f]{8}$/)),
});
export type GetCodesTeamIdResults = z.infer<typeof GetCodesTeamIdResults>;

// PUT /codes

export const PutCodesRequest = z.object({
	code: z.string().check(z.trim(), z.regex(/^[0-9a-fA-F]{8}$/)),
});
export type PutCodesRequest = z.infer<typeof PutCodesRequest>;

export const PutCodesResults = z.object({
	tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type PutCodesResults = z.infer<typeof PutCodesResults>;

// POST /tasks/:tid

export const PostTasksRequest = z.object({
	name: z.string().check(z.trim(), z.minLength(1)),
	desc: z.string().check(z.trim(), z.minLength(1)),
	dead: z.iso.datetime(),
});
export type PostTasksRequest = z.infer<typeof PostTasksRequest>;

export const PostTasksResults = z.object({
	aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type PostTasksResults = z.infer<typeof PostTasksResults>;

// GET /tasks?tid

export const GetTasksResults = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("user"),
		data: z.array(
			z.object({
				aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
				tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
				name: z.string().check(z.trim(), z.minLength(1)),
				team: z.string().check(z.trim(), z.minLength(1)),
				dead: z.iso.datetime(),
			}),
		),
	}),
	z.object({
		type: z.literal("team"),
		data: z.array(
			z.object({
				aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
				name: z.string().check(z.trim(), z.minLength(1)),
				dead: z.iso.datetime(),
			}),
		),
	}),
]);
export type GetTasksResults = z.infer<typeof GetTasksResults>;

// GET /tasks/:aid

// export const GetTasksTaskIdRequest = z.object({
// 	aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
// });
// export type GetTasksTaskIdRequest = z.infer<typeof GetTasksTaskIdRequest>;

// export const GetTasksTaskIdResults = z.discriminatedUnion("auth", [
// 	z.object({
// 		auth: z.literal(true),
// 		name: z.string().check(z.trim(), z.minLength(1)),
// 		desc: z.string().check(z.trim(), z.minLength(1)),
// 		dead: z.iso.datetime(),
// 		// taskfile: z.instanceof(File),
// 	}),
// 	z.object({
// 		auth: z.literal(false),
// 		name: z.string().check(z.trim(), z.minLength(1)),
// 		desc: z.string().check(z.trim(), z.minLength(1)),
// 		dead: z.iso.datetime(),
// 	}),
// ]);
// export type GetTasksTaskIdResults = z.infer<typeof GetTasksTaskIdResults>;
