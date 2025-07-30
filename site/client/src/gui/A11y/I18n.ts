import { defineI18n } from "../../i18n/I18n";

export default defineI18n({
	en: {
		title: "Accessibility",
		os: "System",
		fontsize: { name: "Font Size", sm: "Small", md: "Medium", lg: "Large" },
		language: { name: "Language" },
		darkmode: { name: "Color Theme", no: "Light", on: "Dark" },
		rdmotion: { name: "Motion Effects", no: "On", on: "Off" },
	},
	zh: {
		title: "輔助使用",
		os: "系統",
		fontsize: { name: "字號", sm: "較小", md: "中等", lg: "較大" },
		language: { name: "語言" },
		darkmode: { name: "主題", no: "亮色", on: "暗色" },
		rdmotion: { name: "動效", no: "開啟", on: "關閉" },
	},
});
