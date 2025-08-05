import { defineI18n } from "../../i18n/I18n";

export default defineI18n({
	en: {
		greet: "Nice to have you back. Sign in to resume.",
		email: "Email",
		password: "Password",
		next: "Continue",
		error: {
			generic: "Incorrect Email or Password",
			ratelim: "Too Many Requests",
			systems: "Internal System Error",
		},
		signup: "Create Account",
	},
	zh: {
		greet: "很高興你能回來，登錄以繼續使用",
		email: "電郵",
		password: "密碼",
		next: "繼續",
		error: {
			generic: "電郵或密碼錯誤",
			ratelim: "嘗試次數過多",
			systems: "內部系統錯誤",
		},
		signup: "建立賬號",
	},
});
