import { defineI18n } from "../../gui/I18n";

export default defineI18n({
	en: {
		due: "Due",
		none: "None",
		dash: {
			desc: "Instructions",
			file: "Attachment",
			mywork: "My Submission",
			upload: "Upload File",
		},
		work: {
			submit: "Submit Work",
			revoke: "Undo Submit",
			done: "Submitted",
			ongo: "Not Submitted",
			title: "Submissions",
			outof: "submitted out of",
			work: "Work",
			comm: { ctoa: "Edit Feedback", comm: "Comments", next: "Encourage" },
		},
		team: "Back Team",
	},
	zh: {
		due: "截止",
		none: "無",
		dash: { desc: "任務指引", file: "指引附件", mywork: "我的遞交", upload: "上傳附件" },
		work: {
			submit: "提交作業",
			revoke: "取消提交",
			done: "已提交",
			ongo: "未提交",
			title: "提交情況",
			outof: "份提交，共計",
			work: "文件",
			comm: { ctoa: "編輯反饋", comm: "評語", next: "予以鼓勵" },
		},
		team: "返回群組",
	},
});
