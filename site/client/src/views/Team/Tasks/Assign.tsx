import { PostTeamTaskRequest } from "@app/schema";
import { useNavigate, useParams } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { createTask } from "../../../api/task.api";
import Button2 from "../../../gui/Button2";
import Form from "../../../gui/Form";
import Input from "../../../gui/Input";
import Modal from "../../../gui/Modal";
import TextBox from "../../../gui/TextBox";
import Time from "../../../gui/Time";
import I18n from "./I18n";

export default () => {
	const navigate = useNavigate();
	const { tid } = useParams();
	const t = I18n.useI18n();

	let toggle!: HTMLButtonElement;

	const $error = createSignal<
		| undefined
		| "assign.errors.setname"
		| "assign.errors.setdesc"
		| "assign.errors.invdead"
		| "assign.errors.systems"
	>();
	const [error, setError] = $error;

	const check = (req: PostTeamTaskRequest, submit = false) => {
		if (!submit && !req.desc.length) {
			return undefined;
		}

		const { success, error } = PostTeamTaskRequest.safeParse({
			name: req.name,
			desc: req.desc,
			dead: new Date(req.dead).toISOString(),
		});
		if (success) {
			return undefined;
		}

		switch (error.issues[0].path[0] as keyof PostTeamTaskRequest) {
			case "name": {
				return "assign.errors.setname";
			}
			case "desc": {
				return "assign.errors.setdesc";
			}
			case "dead": {
				return "assign.errors.invdead";
			}
		}
	};

	const submit = async (name: string, desc: string, dead: string) => {
		const { success, data } = PostTeamTaskRequest.safeParse({
			name,
			desc,
			dead: new Date(dead).toISOString(),
		});

		if (!success) {
			return setError(check({ name, desc, dead }, true));
		}

		try {
			const { aid } = await createTask({ tid }, data);
			navigate(`/task/${aid}`);
		} catch {
			setError("assign.errors.systems");
		}
	};

	const now = new Date();
	const tmr = new Date();
	tmr.setDate(now.getDate() + 1);
	tmr.setHours(23, 59);

	return (
		<>
			<Button2
				ref={toggle}
				class="text-lg"
			>
				{t("assign.ctoa")}
			</Button2>
			<Modal toggle={toggle}>
				<Form
					label={t("assign.next")}
					error={createMemo(() => {
						const id = error();
						return id && t(id);
					})}
					check={(name, desc, dead) => {
						setError(check({ name, desc, dead }));
					}}
					cback={submit}
				>
					<Input
						name={t("assign.name")}
						spellcheck="true"
						autocomplete="off"
					></Input>
					<TextBox
						name={t("assign.desc")}
						spellcheck="true"
					></TextBox>
					<Time
						name={t("assign.dead")}
						minimum={now}
						default={tmr}
					></Time>
				</Form>
			</Modal>
		</>
	);
};
