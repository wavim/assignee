import { TeamProfile, zTeamProfile } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { AxiosError } from "axios";
import { createMemo, createSignal } from "solid-js";
import { create } from "../../../../api/team.api";
import Button from "../../../../gui/Button";
import Form from "../../../../gui/Form";
import Modal from "../../../../gui/Modal";
import I18n from "./I18n";

export default () => {
	const navigate = useNavigate();
	const t = I18n.useI18n();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		| undefined
		| "create.errors.setname"
		| "create.errors.setdesc"
		| "errors.ratelim"
		| "errors.systems"
	>();
	const [error, setError] = $error;

	const check = (data: zTeamProfile, submit = false) => {
		if (!submit && !data.desc.length) {
			return undefined;
		}

		const { success, error } = TeamProfile.safeParse(data);

		if (success) {
			return undefined;
		}
		return (error.issues[0].path[0] as keyof zTeamProfile) === "name"
			? "create.errors.setname"
			: "create.errors.setdesc";
	};

	const submit = (name: string, desc: string) => {
		const { success, data } = TeamProfile.safeParse({ name, desc });

		if (!success) {
			return setError(check({ name, desc }, true));
		}

		void create(data)
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
			<Button ref={toggle}>{t("create.ctoa")}</Button>
			<Modal toggle={toggle}>
				<Form
					label={t("create.next")}
					input={[
						{ name: t("create.name"), autocomplete: "organization" },
						{ name: t("create.desc"), autocomplete: "off" },
					]}
					error={createMemo(() => {
						const id = error();
						return id && t(id);
					})}
					check={(name, desc) => {
						setError(check({ name, desc }));
					}}
					cback={submit}
					class="w-72"
				></Form>
			</Modal>
		</>
	);
};
