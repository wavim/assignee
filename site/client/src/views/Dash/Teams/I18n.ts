import { defineI18n } from "../../../gui/I18n";

export default defineI18n({
	en: {
		prompt: "Add a team to begin.",
		normal: "Normal View",
		badged: "Badged View",
		owner: "Owner",
		member: "Member",
		errors: { systems: "Internal System Error" },
		create: {
			ctoa: "Create Team",
			name: "Name",
			desc: "Description",
			next: "Commence",
			errors: { setname: "Name Required", setdesc: "Description Required" },
		},
		accept: {
			ctoa: "Join Team",
			code: "Invite Code",
			next: "Embrace",
			errors: { invcode: "Invalid Code" },
		},
	},
	zh: {
		prompt: "新增群組以開始使用",
		normal: "普通視圖",
		badged: "群主視圖",
		owner: "群主",
		member: "群員",
		errors: { systems: "內部系統錯誤" },
		create: {
			ctoa: "創建群組",
			name: "群名",
			desc: "備註",
			next: "建立",
			errors: { setname: "群組不能無名", setdesc: "請提供群備註" },
		},
		accept: { ctoa: "加入群組", code: "邀請碼", next: "受邀", errors: { invcode: "邀請碼不正確" } },
	},
});
