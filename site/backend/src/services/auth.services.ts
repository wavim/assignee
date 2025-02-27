import sgMail from "@sendgrid/mail";

import { configs } from "configs.js";
import { prisma } from "prisma/client.prisma.js";
import { authcodeEmail } from "./assets/authcode.template.js";
import { CryptUtils } from "./utils/crypt.util.js";

export namespace AuthServices {
	export async function sendAuthcode(data: { uid: bigint; email: string; name: string }): Promise<void> {
		try {
			await prisma.authcode.delete({
				where: {
					uid: data.uid,
				},
			});
		} catch {}

		const code = CryptUtils.randomCode(6);
		const salt = CryptUtils.randomBytes(16);
		const hash = CryptUtils.hash(code, salt);
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
