// prettier-ignore
import {
	email, int, length as len, toLowerCase as lower, minLength as min, object as obj, positive as pos, regex, string as str, trim, infer as zType,
} from "zod/mini";

export const BearerToken = obj({
	sid: int().check(pos()),
	key: str().check(len(64), regex(/^[0-9a-f]*$/)),
});
export type zBearerToken = zType<typeof BearerToken>;

export const Credentials = obj({
	mail: str().check(trim(), lower(), email()),
	pass: str().check(min(8), regex(/^[\x20-\x7E]*$/)),
});
export type zCredentials = zType<typeof Credentials>;

export const TeamDetails = obj({
	name: str().check(trim()),
	desc: str().check(trim()),
});
export type zTeamDetails = zType<typeof TeamDetails>;
