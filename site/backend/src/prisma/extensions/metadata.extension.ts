import { Prisma } from "@prisma/client";

const TABLES_WITH_CREATED = [
	"User",
	"Authcode",
	"Session",
	"Team",
	"Invitation",
	"Membership",
	"Appointment",
	"Assignment",
	"AssignmentAttachment",
	"Submission",
	"SubmissionAttachment",
];
const TABLES_WITH_UPDATED = ["User", "Password", "Preference", "Team", "Assignment", "Submission"];
const TIME_STAMP = () => BigInt(Date.now()) / 1000n;

export const TableMetadataExtension = Prisma.defineExtension({
	query: {
		$allModels: {
			create({ model, args, query }) {
				const now = TIME_STAMP();
				//@ts-ignore
				if (TABLES_WITH_CREATED.includes(model)) args.data.created = now;
				//@ts-ignore
				if (TABLES_WITH_UPDATED.includes(model)) args.data.updated = now;
				//@ts-ignore
				else args.data.updated = now;
				return query(args);
			},
			createMany({ model, args, query }) {
				const now = TIME_STAMP();
				if (!("length" in args.data)) {
					//@ts-ignore
					if (TABLES_WITH_CREATED.includes(model)) args.data.created = now;
					//@ts-ignore
					if (TABLES_WITH_UPDATED.includes(model)) args.data.updated = now;
					//@ts-ignore
					else args.data.updated = now;
					return query(args);
				}
				for (const item of args.data) {
					//@ts-ignore
					if (TABLES_WITH_CREATED.includes(model)) item.created = now;
					//@ts-ignore
					if (TABLES_WITH_UPDATED.includes(model)) args.data.updated = now;
					//@ts-ignore
					else item.updated = now;
				}
				return query(args);
			},
			update({ model, args, query }) {
				const now = TIME_STAMP();
				//@ts-ignore
				if (TABLES_WITH_UPDATED.includes(model)) args.data.updated = now;
				else throw new Error(`Query attempts to update readonly field: ${query}`);
				return query(args);
			},
			updateMany({ model, args, query }) {
				const now = TIME_STAMP();
				//@ts-ignore
				if (TABLES_WITH_UPDATED.includes(model)) args.data.updated = now;
				else throw new Error(`Query attempts to update readonly field: ${query}`);
				return query(args);
			},
		},
	},
});
