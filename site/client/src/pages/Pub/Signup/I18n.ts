import { defineI18n } from "../../../gui/I18n";

export default defineI18n({
	en: {
		header: "Delighted to have you. Sign up to probe.",
		action: "Explore",
		signin: "Login Instead",
		errors: {
			mailfmt: "Invalid Email Format",
			passlen: "Password Shorter Than 8",
			emailna: "Email Not Available",
			ratelim: "Too Many Requests",
			systems: "Internal System Error",
		},
	},
	zh: {
		header: "很慶幸有你，註冊賬號以開始探索",
		action: "啟航",
		signin: "已有賬號",
		errors: {
			mailfmt: "電郵格式錯誤",
			passlen: "密碼短于八位",
			emailna: "電郵已經註冊",
			ratelim: "嘗試次數過多",
			systems: "內部系統錯誤",
		},
	},
});
