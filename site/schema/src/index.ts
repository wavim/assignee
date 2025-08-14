// prettier-ignore
import {
	array as arr, boolean as bit, email, int, iso, length as len, toLowerCase as lower, minLength as min, object as obj, positive as pos, regex, string as str, trim, toUpperCase as upper, infer as zType,
} from "zod/mini";

export const Credentials = obj({
	mail: str().check(trim(), lower(), email()),
	pass: str().check(min(8), regex(/^[\x20-\x7E]*$/)),
});
export type zCredentials = zType<typeof Credentials>;

export const BearerToken = obj({
	sid: int().check(pos()),
	key: str().check(len(64), regex(/^[0-9a-f]*$/)),
});
export type zBearerToken = zType<typeof BearerToken>;

export const UserProfile = obj({
	mail: str().check(trim(), lower(), email()),
	name: str().check(trim(), min(1)),
});
export type zUserProfile = zType<typeof UserProfile>;

export const TeamID = obj({
	hash: str().check(min(8), regex(/^[0-9a-zA-Z]*$/)),
});
export type zTeamID = zType<typeof TeamID>;

export const TeamProfile = obj({
	name: str().check(trim(), min(1)),
	desc: str().check(trim(), min(1)),
});
export type zTeamProfile = zType<typeof TeamProfile>;

export const TeamBase = obj({
	...TeamID.shape,
	...TeamProfile.shape,
});
export type zTeamBase = zType<typeof TeamBase>;

export const Membership = arr(
	obj({
		...TeamBase.shape,
		auth: bit(),
	}),
);
export type zMembership = zType<typeof Membership>;

export const InviteCode = obj({
	code: str().check(trim(), upper(), regex(/^[0-9A-F]*$/)),
});
export type zInviteCode = zType<typeof InviteCode>;

export const TeamMembers = arr(
	obj({
		...UserProfile.shape,
		auth: bit(),
	}),
);
export type zTeamMembers = zType<typeof TeamMembers>;

export const TeamDetails = obj({
	...TeamProfile.shape,
	memb: TeamMembers,
	auth: bit(),
});
export type zTeamDetails = zType<typeof TeamDetails>;

export const TaskID = obj({
	hash: str().check(min(8), regex(/^[0-9a-zA-Z]*$/)),
});
export type zTaskID = zType<typeof TaskID>;

export const TaskDetails = obj({
	name: str().check(trim(), min(1)),
	desc: str().check(trim(), min(1)),
	dead: iso.datetime(),
});
export type zTaskDetails = zType<typeof TaskDetails>;
