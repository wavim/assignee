import { PutMembRequest } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wavim/http-error";
import { isAxiosError } from "axios";
import { createMemo, createSignal } from "solid-js";
import { putMemb } from "../../../api/code.api";
import Button2 from "../../../gui/Button2";
import Form from "../../../gui/Form";
import Input from "../../../gui/Input";
import Modal from "../../../gui/Modal";
import I18n from "../I18n";

export default () => {
	const t = I18n.useI18n();
	const navigate = useNavigate();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<undefined | "teams.accept.errors.invcode" | "teams.errors.systems">();
	const [error, setError] = $error;

	const submit = async (code: string) => {
		const { success, data } = PutMembRequest.safeParse({ code });

		if (!success) {
			return setError("teams.accept.errors.invcode");
		}

		try {
			const { tid } = await putMemb(data);
			navigate(`/team/${tid}`);
		} catch (e) {
			if (!isAxiosError(e) || !e.response) {
				return setError("teams.errors.systems");
			}
			if ((e.response.status as ErrorCode) === ErrorCode.FORBIDDEN) {
				return setError("teams.accept.errors.invcode");
			}
			setError("teams.errors.systems");
		}
	};

	return (
		<>
			<Button2
				ref={toggle}
				class="text-xl"
			>
				{t("teams.accept.ctoa")}
			</Button2>
			<Modal toggle={toggle}>
				<Form
					label={t("teams.accept.next")}
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
						name={t("teams.accept.code")}
						spellcheck="false"
						autocomplete="off"
						style={{ "text-transform": "uppercase" }}
					></Input>
				</Form>
			</Modal>
		</>
	);
};
