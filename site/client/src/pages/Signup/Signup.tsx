import { AuthId, zAuthId } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { createMemo, createSignal } from "solid-js";
import { signup } from "../../api/auth.api";
import Signer from "../../gui/Signer/Signer";
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
		| "errors.emailre"
		| "errors.passlen"
		| "errors.emailna"
		| "errors.ratelim"
		| "errors.systems"
	>();
	const [error, setError] = $error;

	const check = (authid: zAuthId) => {
		if (!authid.pwd.length) {
			return undefined;
		}

		const { success, error } = AuthId.safeParse(authid);

		if (success) {
			return undefined;
		}

		return (error.issues[0].path[0] as "eml" | "pwd") === "eml"
			? "errors.emailre"
			: "errors.passlen";
	};

	const submit = async (authid: zAuthId) => {
		const { success, data } = AuthId.safeParse(authid);

		if (!success) {
			return setError(check(authid));
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
			case ErrorCode.INTERNAL_SERVER_ERROR: {
				return setError("errors.systems");
			}
		}
	};

	return (
		<Signer
			header={t("header")}
			action={t("action")}
			submit={submit}
			error={createMemo(() => {
				const id = error();
				return id && t(id);
			})}
			check={(authid) => {
				setError(check(authid));
			}}
			alturl="/signin"
			altnav={t("signin")}
		></Signer>
	);
};
