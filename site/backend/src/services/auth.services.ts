import { k12 } from "@noble/hashes/sha3-addons";
import { randomBytes } from "@noble/hashes/utils";
import sgMail from "@sendgrid/mail";
import { configs } from "configs.js";
import { prisma } from "prisma/client.prisma.js";
import { authcodeEmail } from "./assets/authcode.email.js";

sgMail.setApiKey(configs.auth.sgApiKey);

export namespace AuthServices {
	export function hash(raw: string): { hash: Uint8Array; salt: Uint8Array } {
		const key = new TextEncoder().encode(raw);
		const salt = randomBytes(16);

		const concat = new Uint8Array(key.length + 16);
		concat.set(key);
		concat.set(salt, key.length);

		const hash = k12(concat, { dkLen: 32 });

		return { hash, salt };
	}

	export function randomNumCode(length: number): string {
		const num = Math.floor(Math.random() * 10 ** length);
		return `${num}`.padStart(length, "0");
	}

	export async function sendAuthcode(data: { uid: bigint; email: string; name: string }): Promise<void> {
		try {
			await prisma.authcode.delete({
				where: {
					uid: data.uid,
				},
			});
		} catch {}

		const code = randomNumCode(6);
		const { hash, salt } = AuthServices.hash(code);
		await prisma.authcode.create({
			data: {
				uid: data.uid,
				hash,
				salt,
				created: 0,
			},
		});

		console.log("send attempt");
		await sgMail.send({
			from: configs.auth.sgSender,
			to: data.email,
			subject: "Assignee Authcode",
			html: authcodeEmail(data.name, code),
		});
		console.log("sent");
	}
}
