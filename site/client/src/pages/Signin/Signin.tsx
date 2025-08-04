import { AuthId } from "@app/schema";
import Button from "../../gui/Button";
import Footer from "../../gui/Footer/Footer";
import Guest from "../../gui/Guest";
import Header from "../../gui/Header/Header";
import Input from "../../gui/Input/Input";
import Main from "../../gui/Main";
import I18n from "./I18n";

export default () => (
	<Guest>
		<I18n.I18n>
			<Header></Header>
			<Main>
				<Form></Form>
			</Main>
			<Footer></Footer>
		</I18n.I18n>
	</Guest>
);

const Form = () => {
	const t = I18n.useI18n();

	let eml!: HTMLInputElement;
	let pwd!: HTMLInputElement;

	return (
		<section class="flex flex-col gap-8 px-8 md:gap-12">
			<h1 class="font-jakarta md: text-text-major text-3xl font-medium md:self-center">
				{t("greet")}
			</h1>
			<form class="flex w-full max-w-110 flex-col gap-4 self-center">
				<Input
					ref={eml}
					type="email"
					name={t("email")}
					spellcheck="false"
					autocomplete="email"
				></Input>
				<Input
					ref={pwd}
					type="password"
					name={t("password")}
					autocomplete="current-password"
				></Input>
				<Button
					onclick={() => {
						const { success, data, error } = AuthId.safeParse({
							eml: eml.value,
							pwd: pwd.value,
						});
						if (!success) {
						}
					}}
					class="mt-4"
				>
					{t("next")}
				</Button>
			</form>
		</section>
	);
};
