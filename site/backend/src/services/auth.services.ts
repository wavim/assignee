import sgMail from "@sendgrid/mail";

import { configs } from "configs.js";
import { prisma } from "prisma/client.prisma.js";
import { authcodeEmail } from "./assets/authcode.template.js";
import { CryptUtil } from "./utils/crypt.util.js";

export namespace AuthServices {
	export async function sendAuthcode(data: { uid: bigint; email: string; name: string }): Promise<void> {
		try {
			await prisma.authcode.delete({
				where: {
					uid: data.uid,
				},
			});
		} catch {}

		const code = CryptUtil.randomCode(6);
		const salt = CryptUtil.randomBytes(16);
		const hash = CryptUtil.hash(code, salt);
		await prisma.authcode.create({
			data: {
				uid: data.uid,
				hash,
				salt,
				created: 0,
			},
		});

		sgMail.setApiKey(configs.auth.sgApiKey);
		await sgMail.send({
			from: configs.auth.sgSender,
			to: data.email,
			subject: "Assignee Authcode",
			html: authcodeEmail({
				name: data.name,
				code,
			}),
		});
	}
}
