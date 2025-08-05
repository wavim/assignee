import { zAuthId } from "@app/schema";
import { A } from "@solidjs/router";
import { Accessor } from "solid-js";
import Button from "../../gui/Button";
import Footer from "../../gui/Footer/Footer";
import Guest from "../../gui/Guest";
import Header from "../../gui/Header/Header";
import Input from "../../gui/Input/Input";
import Main from "../../gui/Main";
import I18n from "./I18n";

interface FormProps {
	header: string;
	action: string;
	submit: (authid: zAuthId) => unknown;

	error: Accessor<undefined | string>;
	check: (authid: zAuthId) => unknown;

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

	let eml!: HTMLInputElement;
	let pwd!: HTMLInputElement;

	const check = () => {
		props.check({ eml: eml.value, pwd: pwd.value });
	};

	return (
		<section class="flex flex-col items-center gap-8 px-8 md:gap-12">
			<h1 class="font-jakarta text-text-major text-3xl font-medium md:text-4xl">
				{props.header}
			</h1>
			<form class="flex w-full max-w-110 flex-col gap-4">
				<Input
					ref={eml}
					type="email"
					name={t("email")}
					oninput={check}
					spellcheck="false"
					autocomplete="email"
				></Input>
				<Input
					ref={pwd}
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
						props.submit({ eml: eml.value, pwd: pwd.value });
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
