import { PostTeamRequest } from "@app/schema";
import { useNavigate } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { createTeam } from "../../../api/team.api";
import Button1 from "../../../gui/Button1";
import Form from "../../../gui/Form";
import Input from "../../../gui/Input";
import Modal from "../../../gui/Modal";
import TextArea from "../../../gui/TextArea";
import I18n from "./I18n";

export default () => {
	const navigate = useNavigate();
	const t = I18n.useI18n();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		undefined | "create.errors.setname" | "create.errors.setdesc" | "errors.systems"
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
			? "create.errors.setname"
			: "create.errors.setdesc";
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
			setError("errors.systems");
		}
	};

	return (
		<>
			<Button1 ref={toggle}>{t("create.ctoa")}</Button1>
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
						spellcheck="true"
						autocomplete="organization"
					></Input>
					<TextArea
						name={t("create.desc")}
						spellcheck="true"
					></TextArea>
				</Form>
			</Modal>
		</>
	);
};
