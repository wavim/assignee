import { defineI18n } from "../../i18n/I18n";

export default defineI18n({
	en: {
		header: "Delighted to have you. Sign up to probe.",
		action: "Explore",
		errors: {
			emailre: "Invalid Email Format",
			passlen: "Password Length ≥ 8",
			emailna: "Email Not Available",
			ratelim: "Too Many Requests",
			systems: "Internal System Error",
		},
		signin: "Login Instead",
	},
	zh: {
		header: "很慶幸有你，註冊賬號以開始探索",
		action: "啟航",
		errors: {
			emailre: "電郵格式錯誤",
			passlen: "密碼須八位起",
			emailna: "電郵已經註冊",
			ratelim: "嘗試次數過多",
			systems: "內部系統錯誤",
		},
		signin: "已有賬號",
	},
});
