import { PostTeamRequest } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { createTeam } from "../../../api/team.api";
import Button1 from "../../../gui/Button1";
import Form from "../../../gui/Form";
import Input from "../../../gui/Input";
import Modal from "../../../gui/Modal";
import TextBox from "../../../gui/TextBox";
import I18n from "../I18n";

export default () => {
	const navigate = useNavigate();
	const t = I18n.useI18n();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		| undefined
		| "teams.create.errors.setname"
		| "teams.create.errors.setdesc"
		| "teams.errors.systems"
	>();
	const [error, setError] = $error;

	const check = (req: PostTeamRequest, submit = false) => {
		if (!submit && !req.desc.length) {
			return undefined;
		}

		const { success, error } = PostTeamRequest.safeParse(req);

		if (success) {
			return undefined;
		}
		return (error.issues[0].path[0] as keyof PostTeamRequest) === "name"
			? "teams.create.errors.setname"
			: "teams.create.errors.setdesc";
	};

	const submit = async (name: string, desc: string) => {
		const { success, data } = PostTeamRequest.safeParse({ name, desc });

		if (!success) {
			return setError(check({ name, desc }, true));
		}

		try {
			const { tid } = await createTeam(data);
			navigate(`/team/${tid}`);
		} catch {
			setError("teams.errors.systems");
		}
	};

	return (
		<>
			<Button1 ref={toggle}>{t("teams.create.ctoa")}</Button1>
			<Modal toggle={toggle}>
				<Form
					label={t("teams.create.next")}
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
						name={t("teams.create.name")}
						spellcheck="true"
						autocomplete="organization"
					></Input>
					<TextBox
						name={t("teams.create.desc")}
						spellcheck="true"
					></TextBox>
				</Form>
			</Modal>
		</>
	);
};
