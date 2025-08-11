import { Credentials, zCredentials } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { createMemo, createSignal } from "solid-js";
import { signup } from "../../../api/auth.api";
import Signer from "../Signer";
import I18n from "./I18n";

export default () => (
	<I18n.I18n>
		<Form></Form>
	</I18n.I18n>
);

const Form = () => {
	const t = I18n.useI18n();
	const navigate = useNavigate();

	const $error = createSignal<
		| undefined
		| "errors.mailfmt"
		| "errors.passlen"
		| "errors.emailna"
		| "errors.ratelim"
		| "errors.systems"
	>();
	const [error, setError] = $error;

	const check = (creds: zCredentials, submit = false) => {
		if (!submit && !creds.pass.length) {
			return undefined;
		}

		const { success, error } = Credentials.safeParse(creds);

		if (success) {
			return undefined;
		}

		return (error.issues[0].path[0] as keyof zCredentials) === "mail"
			? "errors.mailfmt"
			: "errors.passlen";
	};

	const submit = async (creds: zCredentials) => {
		const { success, data } = Credentials.safeParse(creds);

		if (!success) {
			return setError(check(creds, true));
		}

		switch (await signup(data)) {
			case 200: {
				navigate("/app", { replace: true });
				break;
			}
			case ErrorCode.CONFLICT: {
				return setError("errors.emailna");
			}
			case ErrorCode.TOO_MANY_REQUESTS: {
				return setError("errors.ratelim");
			}
			default: {
				return setError("errors.systems");
			}
		}
	};

	return (
		<Signer
			header={t("header")}
			action={t("action")}
			error={createMemo(() => {
				const id = error();
				return id && t(id);
			})}
			check={(creds) => {
				setError(check(creds));
			}}
			cback={submit}
			alturl="/signin"
			altnav={t("signin")}
		></Signer>
	);
};
