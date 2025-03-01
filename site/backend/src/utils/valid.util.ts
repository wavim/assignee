import { configs } from "configs.js";

export namespace ValidUtils {
	/**
	 * This only filters dummy inputs,
	 * as RE alone CANNOT validate an email, details in report.
	 */
	export function isEmailValid(email: string): boolean {
		return /^\S+@\S+\.\S+$/.test(email);
	}

	export function isPasswordValid(password: string): boolean {
		if (password.length < configs.valid.minPasswordLen) return false;

		const reLower = /[a-z]+/;
		const reUpper = /[A-Z]+/;
		const reDigits = /\d+/;
		if (!reLower.test(password)) return false;
		if (!reUpper.test(password)) return false;
		if (!reDigits.test(password)) return false;

		return true;
	}
}
