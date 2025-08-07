import { Credentials, zCredentials } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { createMemo, createSignal } from "solid-js";
import { signin } from "../../api/auth.api";
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
		undefined | "errors.generic" | "errors.ratelim" | "errors.systems"
	>();
	const [error, setError] = $error;

	const submit = async (creds: zCredentials) => {
		const { success, data } = Credentials.safeParse(creds);

		if (!success) {
			return setError("errors.generic");
		}

		switch (await signin(data)) {
			case 200: {
				navigate("/app", { replace: true });
				break;
			}
			case ErrorCode.UNAUTHORIZED: {
				return setError("errors.generic");
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
			check={() => {
				setError();
			}}
			alturl="/signup"
			altnav={t("signup")}
		></Signer>
	);
};
