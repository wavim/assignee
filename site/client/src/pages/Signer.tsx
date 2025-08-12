import { zCredentials } from "@app/schema";
import { A } from "@solidjs/router";
import { Accessor } from "solid-js";
import Form from "../gui/Form";
import Guard from "../gui/Guard";
import { defineI18n } from "../gui/I18n";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";

const I18n = defineI18n({
	en: { email: "Email", password: "Password" },
	zh: { email: "電郵", password: "密碼" },
});

interface SignProps {
	header: string;
	action: string;
	error: Accessor<string | undefined>;
	check: (creds: zCredentials) => unknown;
	cback: (creds: zCredentials) => unknown;
	alturl: "/signin" | "/signup";
	altnav: string;
}

export default (props: SignProps) => (
	<Guard landing>
		<I18n.I18n>
			<Header></Header>
			<Main>
				<Sign {...props}></Sign>
			</Main>
			<Footer></Footer>
		</I18n.I18n>
	</Guard>
);

const Sign = (props: SignProps) => {
	const t = I18n.useI18n();

	return (
		<section class="flex flex-col items-center justify-center px-8 md:min-h-dvh">
			<h1 class="font-jakarta text-text-major mb-8 text-3xl font-medium md:mb-12 md:text-4xl">
				{props.header}
			</h1>
			<Form
				label={props.action}
				input={[
					{ name: t("email"), type: "email", spellcheck: false, autocomplete: "email" },
					{
						name: t("password"),
						type: "password",
						spellcheck: false,
						autocomplete: props.alturl === "/signin" ? "new-password" : "current-password",
					},
				]}
				error={props.error}
				check={(mail, pass) => props.check({ mail, pass })}
				cback={(mail, pass) => props.cback({ mail, pass })}
				class="w-full max-w-110"
			></Form>
			<A
				href={props.alturl}
				class="text-text-major font-jakarta mt-8 text-center text-lg"
			>
				{`${props.altnav} ›`}
			</A>
		</section>
	);
};
