import { defineI18n } from "../../gui/I18n";

export default defineI18n({
	en: {
		due: "Due",
		desc: "Instructions",
		file: "Attachment",
		work: "My Submission",
		none: "None",
		upload: "Upload File",
		submit: "Submit Work",
		revoke: "Undo Submit",
		status: { done: "Submitted", ongo: "Not Submitted" },
		works: "Submissions",
		outof: "submitted out of",
		grade: { work: "Work", ctoa: "Edit Feedback", comm: "Comments", next: "Encourage" },
	},
	zh: {
		due: "截止",
		desc: "任務指引",
		file: "指引附件",
		work: "我的遞交",
		none: "無",
		upload: "上傳附件",
		submit: "提交作業",
		revoke: "取消提交",
		status: { done: "已提交", ongo: "未提交" },
		works: "提交情況",
		outof: "份提交，共計",
		grade: { work: "文件", ctoa: "編輯反饋", comm: "評語", next: "予以鼓勵" },
	},
});
