import { resolve } from "path";
import { fileURLToPath } from "url";

export const $server = resolve(
	fileURLToPath(import.meta.url),
	Object.hasOwn(process, "pkg") ? "../.." : "../../..",
);
