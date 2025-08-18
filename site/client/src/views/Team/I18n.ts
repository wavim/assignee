import { defineI18n } from "../../gui/I18n";

export default defineI18n({
	en: {
		dash: "Dashboard",
		code: "Invite Code",
		tasks: {
			name: "Assignments",
			submit: "Submitted",
			assign: {
				ctoa: "Assign Task",
				name: "Title",
				desc: "Details",
				dead: "Deadline",
				next: "Distribute",
				errors: {
					setname: "Title Required",
					setdesc: "Details Required",
					invdead: "Invalid Deadline",
					systems: "Internal System Error",
				},
			},
		},
		membs: { name: "Members" },
	},
	zh: {
		dash: "返回主頁",
		code: "邀請碼",
		tasks: {
			name: "任務",
			submit: "已提交",
			assign: {
				ctoa: "佈置任務",
				name: "標題",
				desc: "詳情",
				dead: "截止",
				next: "發佈",
				errors: {
					setname: "任務不能無題",
					setdesc: "請提供指引文",
					invdead: "截止日期錯誤",
					systems: "內部系統錯誤",
				},
			},
		},
		membs: { name: "群成員" },
	},
});
