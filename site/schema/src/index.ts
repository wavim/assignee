import { z } from "zod";

export const AuthId = z.object({
  eml: z.email(),
  pwd: z.string().min(8).regex(/^[\x20-\x7E]*$/),
});
export type zAuthId = z.infer<typeof AuthId>;

export const Bearer = z.object({
  sid: z.int(),
  key: z.base64().length(32),
});
export type zBearer = z.infer<typeof Bearer>;
