import { InviteCode } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { AxiosError } from "axios";
import { createMemo, createSignal } from "solid-js";
import { accept } from "../../../api/team.api";
import Form from "../../../gui/Form";
import Modal from "../../../gui/Modal";
import I18n from "./I18n";

export default () => {
	const t = I18n.useI18n();
	const navigate = useNavigate();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		| undefined
		| "accept.errors.notcode"
		| "accept.errors.already"
		| "errors.ratelim"
		| "errors.systems"
	>();
	const [error, setError] = $error;

	const submit = (code: string) => {
		const { success, data } = InviteCode.safeParse({ code });

		if (!success) {
			return setError("accept.errors.notcode");
		}

		void accept(data)
			.then(({ hash }) => {
				navigate("/team/" + hash);
			})
			.catch((e: unknown) => {
				if (!(e instanceof AxiosError && e.response)) {
					return setError("errors.systems");
				}
				switch (e.response.status as ErrorCode) {
					case ErrorCode.UNAUTHORIZED: {
						navigate("/", { replace: true });
						break;
					}
					case ErrorCode.CONFLICT: {
						return setError("accept.errors.already");
					}
					case ErrorCode.TOO_MANY_REQUESTS: {
						return setError("errors.ratelim");
					}
					default: {
						return setError("errors.systems");
					}
				}
			});
	};

	return (
		<>
			<button
				ref={toggle}
				type="button"
				class="font-jakarta text-text-major cursor-pointer text-xl"
			>
				{`${t("accept.ctoa")} ›`}
			</button>
			<Modal toggle={toggle}>
				<Form
					label={t("accept.next")}
					input={[
						{ name: t("accept.code"), autocomplete: "off", style: "text-transform:uppercase" },
					]}
					error={createMemo(() => {
						const id = error();
						return id && t(id);
					})}
					check={() => {
						setError();
					}}
					cback={submit}
					class="my-2 w-72"
				></Form>
			</Modal>
		</>
	);
};
