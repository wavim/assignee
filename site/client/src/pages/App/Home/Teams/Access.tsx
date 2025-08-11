import { InviterCode } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { AxiosError } from "axios";
import { createMemo, createSignal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { access } from "../../../../api/team.api";
import Form from "../../../../gui/Form";
import Modal from "../../../../gui/Modal";
import { Status } from "../../../../types/status";
import I18n from "./I18n";

export default (props: { update: SetStoreFunction<Status> }) => {
	const t = I18n.useI18n();
	const navigate = useNavigate();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		| undefined
		| "access.errors.notcode"
		| "access.errors.already"
		| "errors.ratelim"
		| "errors.systems"
	>();
	const [error, setError] = $error;

	const submit = (code: string) => {
		const { success, data } = InviterCode.safeParse({ code });

		if (!success) {
			return setError("access.errors.notcode");
		}

		void access(data)
			.then((payload) => {
				props.update("members", (old) => [...old, { auth: false, ...payload }]);
				navigate("/team/" + payload.hash);
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
						return setError("access.errors.already");
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
				class="font-jakarta text-text-major cursor-pointer text-xl"
			>
				{`${t("access.ctoa")} ›`}
			</button>
			<Modal toggle={toggle}>
				<Form
					label={t("access.next")}
					input={[
						{ name: t("access.code"), autocomplete: "off", style: "text-transform:uppercase" },
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
