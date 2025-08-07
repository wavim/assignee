import { zCredentials } from "@app/schema";
import { A } from "@solidjs/router";
import { Accessor } from "solid-js";
import Button from "../Button";
import Footer from "../Footer/Footer";
import Guest from "../Guest";
import Header from "../Header/Header";
import Input from "../Input/Input";
import Main from "../Main";
import I18n from "./I18n";

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
	<Guest>
		<I18n.I18n>
			<Header></Header>
			<Main>
				<Form {...props}></Form>
			</Main>
			<Footer></Footer>
		</I18n.I18n>
	</Guest>
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
			<h1 class="font-jakarta text-text-major text-3xl font-medium md:text-4xl">
				{props.header}
			</h1>
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
					autocomplete={
						props.alturl === "/signin"
							? "new-password"
							: "current-password"
					}
				></Input>
				<Button
					aria-label={props.action}
					onclick={() => {
						props.submit({
							mail: mail.value,
							pass: pass.value,
						});
					}}
					class="mt-4"
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
