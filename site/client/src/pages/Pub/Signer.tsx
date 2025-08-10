import { zCredentials } from "@app/schema";
import { A } from "@solidjs/router";
import { Accessor } from "solid-js";
import Button from "../../gui/Button";
import Guard from "../../gui/Guard";
import { defineI18n } from "../../gui/I18n";
import Input from "../../gui/Input";
import Footer from "../../gui/Footer";
import Header from "./Header";
import Main from "./Main";

const I18n = defineI18n({
	en: { email: "Email", password: "Password" },
	zh: { email: "電郵", password: "密碼" },
});

interface FormProps {
	header: string;
	action: string;
	submit: (creds: zCredentials) => unknown;

	error: Accessor<undefined | string>;
	check: (creds: zCredentials) => unknown;

	alturl: "/signin" | "/signup";
	altnav: string;
}

export default (props: FormProps) => (
	<Guard landing>
		<I18n.I18n>
			<Header></Header>
			<Main>
				<Form {...props}></Form>
			</Main>
			<Footer></Footer>
		</I18n.I18n>
	</Guard>
);

const Form = (props: FormProps) => {
	const t = I18n.useI18n();

	let mail!: HTMLInputElement;
	let pass!: HTMLInputElement;

	const check = () => {
		props.check({ mail: mail.value, pass: pass.value });
	};

	return (
		<section class="flex flex-col items-center gap-8 px-8 md:gap-12">
			<h1 class="font-jakarta text-text-major text-3xl font-medium md:text-4xl">{props.header}</h1>
			<form class="flex w-full max-w-110 flex-col gap-4">
				<Input
					ref={mail}
					type="email"
					name={t("email")}
					oninput={check}
					spellcheck="false"
					autocomplete="email"
				></Input>
				<Input
					ref={pass}
					type="password"
					name={t("password")}
					oninput={check}
					autocomplete={props.alturl === "/signin" ? "new-password" : "current-password"}
				></Input>
				<Button
					onclick={() => {
						props.submit({ mail: mail.value, pass: pass.value });
					}}
					aria-label={props.action}
					class="mt-4"
					full
				>
					{props.error() ?? props.action}
				</Button>
				<A
					href={props.alturl}
					class="text-text-major font-jakarta mt-4 text-center text-lg"
				>
					{`${props.altnav} ›`}
				</A>
			</form>
		</section>
	);
};
