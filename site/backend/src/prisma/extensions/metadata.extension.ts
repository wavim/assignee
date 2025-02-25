import { Prisma } from "@prisma/client";
import { PrismaTypes } from "prisma/types.prisma.js";

export const TableMetadataExtension = Prisma.defineExtension({
	query: {
		$allModels: {
			create({ args, query }) {
				setMetadata(args.data, true);
				return query(args);
			},
			createMany({ args, query }) {
				if (!("length" in args.data)) {
					setMetadata(args.data, true);
					return query(args);
				}
				for (const item of args.data) setMetadata(item, true);
				return query(args);
			},
			update({ args, query }) {
				setMetadata(args.data);
				return query(args);
			},
			updateMany({ args, query }) {
				setMetadata(args.data);
				return query(args);
			},
		},
	},
});

function setMetadata<T extends PrismaTypes.Models>(
	data: Prisma.Args<T, "create" | "createMany" | "update" | "updateMany">["data"],
	isCreate?: boolean,
): void {
	const now = BigInt(Date.now()) / 1000n;
	if (isCreate && "created" in data) data.created = now;
	if ("updated" in data) data.updated = now;
}
