import { defineI18n } from "../../../gui/I18n";

export default defineI18n({
	en: {
		header: "Nice to have you back. Sign in to resume.",
		action: "Continue",
		signup: "Create Account",
		errors: {
			generic: "Invalid Email or Password",
			ratelim: "Too Many Requests",
			systems: "Internal System Error",
		},
	},
	zh: {
		header: "很高興你能回來，登錄以繼續使用",
		action: "繼續",
		signup: "建立賬號",
		errors: { generic: "電郵或密碼錯誤", ratelim: "嘗試次數過多", systems: "內部系統錯誤" },
	},
});
