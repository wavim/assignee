import { PostTeamsRequest } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { createTeam } from "../../../api/teams.api";
import Button from "../../../gui/Button";
import Form from "../../../gui/Form";
import Input from "../../../gui/Input";
import Modal from "../../../gui/Modal";
import I18n from "./I18n";

export default () => {
	const navigate = useNavigate();
	const t = I18n.useI18n();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		undefined | "create.errors.setname" | "create.errors.setdesc" | "errors.systems"
	>();
	const [error, setError] = $error;

	const check = (req: PostTeamsRequest, submit = false) => {
		if (!submit && !req.desc.length) {
			return undefined;
		}

		const { success, error } = PostTeamsRequest.safeParse(req);

		if (success) {
			return undefined;
		}
		return (error.issues[0].path[0] as keyof PostTeamsRequest) === "name"
			? "create.errors.setname"
			: "create.errors.setdesc";
	};

	const submit = async (name: string, desc: string) => {
		const { success, data } = PostTeamsRequest.safeParse({ name, desc });

		if (!success) {
			return setError(check({ name, desc }, true));
		}

		try {
			const { tid } = await createTeam(data);
			navigate(`/team/${tid}`);
		} catch {
			setError("errors.systems");
		}
	};

	return (
		<>
			<Button ref={toggle}>{t("create.ctoa")}</Button>
			<Modal toggle={toggle}>
				<Form
					label={t("create.next")}
					error={createMemo(() => {
						const id = error();
						return id && t(id);
					})}
					check={(name, desc) => {
						setError(check({ name, desc }));
					}}
					cback={submit}
				>
					<Input
						name={t("create.name")}
						autocomplete="organization"
					></Input>
					<Input
						name={t("create.desc")}
						autocomplete="off"
					></Input>
				</Form>
			</Modal>
		</>
	);
};
