import { AuthId } from "@app/schema";
import { A, useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { createSignal } from "solid-js";
import { signin } from "../../api/auth.api";
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
	const navigate = useNavigate();

	let eml!: HTMLInputElement;
	let pwd!: HTMLInputElement;

	const [error, setError] = createSignal<
		undefined | "error.generic" | "error.ratelim" | "error.systems"
	>();

	const clearError = () => {
		setError();
	};

	const onSubmit = () => {
		const { success, data } = AuthId.safeParse({ eml: eml.value, pwd: pwd.value });

		if (!success) {
			return setError("error.generic");
		}

		void signin(data).then((status) => {
			switch (status) {
				case 200: {
					navigate("/app", { replace: true });
					break;
				}
				case ErrorCode.UNAUTHORIZED: {
					return setError("error.generic");
				}
				case ErrorCode.TOO_MANY_REQUESTS: {
					return setError("error.ratelim");
				}
				case ErrorCode.INTERNAL_SERVER_ERROR: {
					return setError("error.systems");
				}
			}
		});
	};

	return (
		<section class="flex flex-col items-center gap-8 px-8 md:gap-12">
			<h1 class="font-jakarta text-text-major text-3xl font-medium md:text-4xl">
				{t("greet")}
			</h1>
			<form class="flex w-full max-w-110 flex-col gap-4">
				<Input
					ref={eml}
					type="email"
					name={t("email")}
					spellcheck="false"
					oninput={clearError}
					autocomplete="email"
				></Input>
				<Input
					ref={pwd}
					type="password"
					name={t("password")}
					oninput={clearError}
					autocomplete="current-password"
				></Input>
				<Button
					aria-label={t("next")}
					onclick={onSubmit}
					class="mt-4"
				>
					{
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						error() ? t(error()!) : t("next")
					}
				</Button>
				<A
					href="/signup"
					class="text-text-major font-jakarta mt-4 text-center text-lg"
				>
					{`${t("signup")} ›`}
				</A>
			</form>
		</section>
	);
};
