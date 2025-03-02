import { StatusCodes } from "http-status-codes";

export namespace ErrorUtils {
	export class ErrorResponse extends Error {
		constructor(public code: StatusCodes, details: string) {
			super(details);
		}
	}
}
