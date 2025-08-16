import { PutCodesRequest } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { isAxiosError } from "axios";
import { createMemo, createSignal } from "solid-js";
import { putCode } from "../../../api/codes.api";
import Form from "../../../gui/Form";
import Input from "../../../gui/Input";
import Modal from "../../../gui/Modal";
import I18n from "./I18n";

export default () => {
	const t = I18n.useI18n();
	const navigate = useNavigate();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		undefined | "accept.errors.invcode" | "accept.errors.already" | "errors.systems"
	>();
	const [error, setError] = $error;

	const submit = async (code: string) => {
		const { success, data } = PutCodesRequest.safeParse({ code });

		if (!success) {
			return setError("accept.errors.invcode");
		}

		try {
			const { tid } = await putCode(data);
			navigate(`/team/${tid}`);
		} catch (e) {
			if (!isAxiosError(e) || !e.response) {
				return setError("errors.systems");
			}
			switch (e.response.status as ErrorCode) {
				case ErrorCode.FORBIDDEN: {
					return setError("accept.errors.invcode");
				}
				case ErrorCode.CONFLICT: {
					return setError("accept.errors.already");
				}
			}
			setError("errors.systems");
		}
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
					error={createMemo(() => {
						const id = error();
						return id && t(id);
					})}
					check={() => {
						setError();
					}}
					cback={submit}
					class="my-2"
				>
					<Input
						name={t("accept.code")}
						autocomplete="off"
						style={{ "text-transform": "uppercase" }}
					></Input>
				</Form>
			</Modal>
		</>
	);
};
