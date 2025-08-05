import { z } from "zod/mini";

export const AuthId = z.object({
  eml: z.email(),
  pwd: z.string().check(z.minLength(8), z.regex(/^[ -~]*$/)),
});
export type zAuthId = z.infer<typeof AuthId>;

export const Bearer = z.object({
  sid: z.int(),
  key: z.string().check(z.length(64), z.regex(/^[a-f\d]*$/)),
});
export type zBearer = z.infer<typeof Bearer>;
