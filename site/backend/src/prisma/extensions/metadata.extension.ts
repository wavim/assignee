import { PrismaClient } from "@prisma/client";

import { getTimestamp } from "utils/timestamp.util.js";

export function useExtensionMetadata<T extends PrismaClient>(client: T) {
	return client.$extends({
		name: "prisma-extension-table-metadata",
		query: {
			$allModels: {
				async create({ args, query }) {
					const now = getTimestamp();
					if ("created" in args.data) args.data = { ...args.data, created: now };
					else args.data = { ...args.data, updated: now };
					return query(args);
				},
				async createMany({ args, query }) {
					const now = getTimestamp();
					if (!("length" in args.data)) {
						if ("created" in args.data) args.data = { ...args.data, created: now };
						else args.data = { ...args.data, updated: now };
						return query(args);
					}
					for (let i = 0; i < args.data.length; i++) {
						const item = args.data[i];
						if ("created" in item) args.data[i] = { ...item, created: now };
						else args.data[i] = { ...item, updated: now };
					}
					return query(args);
				},
				async update({ args, query }) {
					const now = getTimestamp();
					if ("updated" in args.data) args.data = { ...args.data, updated: now };
					else throw new Error(`Query attempts to update readonly field: ${query}`);
					return query(args);
				},
				async updateMany({ args, query }) {
					const now = getTimestamp();
					if ("updated" in args.data) args.data = { ...args.data, updated: now };
					else throw new Error(`Query attempts to update readonly field: ${query}`);
					return query(args);
				},
			},
		},
	});
}
