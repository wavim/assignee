export type ExcludeMeta<Input> = Omit<Input, "created" | "updated">;
