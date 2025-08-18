import * as z from "zod/mini";

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
