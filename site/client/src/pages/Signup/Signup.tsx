import { SignupRequest } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { createMemo, createSignal } from "solid-js";
import { signup } from "../../api/auth.api";
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

	const check = (req: SignupRequest, submit = false) => {
		if (!submit && !req.pass.length) {
			return undefined;
		}

		const { success, error } = SignupRequest.safeParse(req);

		if (success) {
			return undefined;
		}
		return (error.issues[0].path[0] as keyof SignupRequest) === "mail"
			? "errors.mailfmt"
			: "errors.passlen";
	};

	const submit = async (req: SignupRequest) => {
		const { success, data } = SignupRequest.safeParse(req);

		if (!success) {
			return setError(check(req, true));
		}
		switch (await signup(data)) {
			case 204: {
				navigate("/dash", { replace: true });
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
