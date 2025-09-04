import { SigninRequest } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wavim/http-error";
import { createMemo, createSignal } from "solid-js";
import { signin } from "../../api/auth.api";
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

	const $error = createSignal<undefined | "errors.generic" | "errors.ratelim" | "errors.systems">();
	const [error, setError] = $error;

	const submit = async (req: SigninRequest) => {
		const { success, data } = SigninRequest.safeParse(req);

		if (!success) {
			return setError("errors.generic");
		}
		switch (await signin(data)) {
			case 204: {
				navigate("/dash", { replace: true });
				break;
			}
			case ErrorCode.UNAUTHORIZED: {
				return setError("errors.generic");
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
			check={() => {
				setError();
			}}
			cback={submit}
			alturl="/signup"
			altnav={t("signup")}
		></Signer>
	);
};
