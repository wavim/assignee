import * as z from "zod/mini";

// GET /tasks

export const GetTasksResults = z.array(
	z.object({
		aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
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

// GET /tasks/:aid

export const GetTaskRequest = z.object({
	aid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
});
export type GetTaskRequest = z.infer<typeof GetTaskRequest>;

export const GetTaskResults = z.discriminatedUnion("auth", [
	z.object({
		auth: z.literal(true),
		tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
		name: z.string().check(z.trim(), z.minLength(1)),
		desc: z.string().check(z.trim(), z.minLength(1)),
		dead: z.iso.datetime(),
		file: z.optional(z.string().check(z.trim(), z.minLength(1))),
		works: z.array(
			z.object({
				name: z.string().check(z.trim(), z.minLength(1)),
				mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
				file: z.optional(z.string().check(z.trim(), z.minLength(1))),
				done: z.boolean(),
				comm: z.optional(z.string().check(z.trim())),
			}),
		),
	}),
	z.object({
		auth: z.literal(false),
		tid: z.string().check(z.regex(/^[0-9a-zA-Z]{8,}$/)),
		name: z.string().check(z.trim(), z.minLength(1)),
		desc: z.string().check(z.trim(), z.minLength(1)),
		dead: z.iso.datetime(),
		file: z.optional(z.string().check(z.trim(), z.minLength(1))),
		work: z.object({
			file: z.optional(z.string().check(z.trim(), z.minLength(1))),
			done: z.boolean(),
			comm: z.optional(z.string().check(z.trim())),
		}),
	}),
]);
export type GetTaskResults = z.infer<typeof GetTaskResults>;

// PUT /works/:aid

export const PutWorkRequest = z.object({
	done: z.boolean(),
});
export type PutWorkRequest = z.infer<typeof PutWorkRequest>;

// PUT /works/:aid/comm

export const PutUserTaskCommRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
	comm: z.optional(z.string().check(z.trim())),
});
export type PutUserTaskCommRequest = z.infer<typeof PutUserTaskCommRequest>;

// GET /works/:aid/:mail/file

export const GetUserTaskWorkRequest = z.object({
	mail: z.string().check(z.trim(), z.email(), z.toLowerCase()),
});
export type GetUserTaskWorkRequest = z.infer<typeof GetUserTaskWorkRequest>;
