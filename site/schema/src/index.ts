import { z } from "zod/mini";

export const Credentials = z.object({
  mail: z.email(),
  pass: z.string().check(z.minLength(8), z.regex(/^[\x20-\x7E]*$/)),
});
export type zCredentials = z.infer<typeof Credentials>;

export const BearerToken = z.object({
  sid: z.int(),
  key: z.string().check(z.length(64), z.regex(/^[0-9a-f]*$/)),
});
export type zBearerToken = z.infer<typeof BearerToken>;
