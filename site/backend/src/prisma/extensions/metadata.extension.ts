import { Prisma } from "@prisma/client";

const TIME_STAMP = () => BigInt(Date.now()) / 1000n;

export const TableMetadataExtension = Prisma.defineExtension({
	query: {
		$allModels: {
			create({ args, query }) {
				const now = TIME_STAMP();
				if ("created" in args.data) args.data.created = now;
				if ("updated" in args.data) args.data.updated = now;
				return query(args);
			},
			createMany({ args, query }) {
				const now = TIME_STAMP();
				if (!("length" in args.data)) {
					if ("created" in args.data) args.data.created = now;
					if ("updated" in args.data) args.data.updated = now;
					return query(args);
				}
				for (const item of args.data) {
					if ("created" in item) item.created = now;
					if ("updated" in item) item.updated = now;
				}
				return query(args);
			},
			update({ args, query }) {
				const now = TIME_STAMP();
				if ("updated" in args.data) args.data.updated = now;
				else throw new Error(`Query attempts to update readonly table: ${query}`);
				return query(args);
			},
			updateMany({ args, query }) {
				const now = TIME_STAMP();
				if ("updated" in args.data) args.data.updated = now;
				else throw new Error(`Query attempts to update readonly table: ${query}`);
				return query(args);
			},
		},
	},
});
