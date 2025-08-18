import { GetTaskResults } from "@app/schema";
import { useParams } from "@solidjs/router";
import { createMemo, For, Show } from "solid-js";
import { getUserWorkFile, setWorkComm } from "../../../api/task.api";
import Form from "../../../gui/Form";
import Modal from "../../../gui/Modal";
import TextBox from "../../../gui/TextBox";
import Email from "../../Email";
import I18n from "../I18n";

type Extracted = Extract<GetTaskResults, { auth: true }>;

export default (props: { detail: Extracted }) => {
	const t = I18n.useI18n();

	const done = createMemo(() =>
		props.detail.works.filter((w) => w.done).sort((a, b) => a.name.localeCompare(b.name)),
	);
	const ongo = createMemo(() =>
		props.detail.works.filter((w) => !w.done).sort((a, b) => a.name.localeCompare(b.name)),
	);

	const Comm = (props: { mail: string; comm?: string }) => {
		const t = I18n.useI18n();
		const { aid } = useParams();

		let toggle!: HTMLButtonElement;

		return (
			<>
				<button
					ref={toggle}
					type="button"
					title={t("work.comm.ctoa")}
					class="h-6 cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="stroke-text-minor h-full fill-none stroke-2"
					>
						<path d="m15.5 5.5 2.8 2.8M3 21v-.3l.5-2.3.7-1.4c.3-.5.7-.9 1.6-1.8L17.4 3.6c.8-.8 2.1-.8 2.8 0 .8.8.8 2 0 2.8L8.4 18.3l-1.6 1.4-1.2.7-2.1.5-.5.1z" />
					</svg>
				</button>
				<Modal toggle={toggle}>
					<Form
						label={t("work.comm.next")}
						cback={(comment) => {
							void setWorkComm(
								{ aid },
								{ mail: props.mail, comm: comment.trim().length ? comment : undefined },
							);
							window.dispatchEvent(new Event("$close-modal"));
						}}
					>
						<TextBox name={t("work.comm.comm")}>{props.comm}</TextBox>
					</Form>
				</Modal>
			</>
		);
	};
	const Done = (props: { work: Extracted["works"][number] }) => {
		const t = I18n.useI18n();
		const { aid } = useParams();

		return (
			<div class="border-border font-jakarta flex w-full flex-wrap items-center gap-4 rounded-xl border-1 p-3.5 text-lg">
				<span class="text-text-major mr-auto text-lg">{props.work.name}</span>
				<Show when={props.work.file}>
					<a
						href={getUserWorkFile({ aid }, props.work)}
						download={props.work.file}
						class="text-text-major w-max underline underline-offset-2"
					>
						{t("work.work")}
					</a>
				</Show>
				<Comm
					mail={props.work.mail}
					comm={props.work.comm}
				></Comm>
				<Email>{props.work.mail}</Email>
			</div>
		);
	};

	const Ongo = (props: { work: Extracted["works"][number] }) => (
		<div class="border-border font-jakarta flex w-full flex-wrap items-center gap-4 rounded-xl border-1 p-3.5 text-lg">
			<span class="text-text-major mr-auto text-lg">{props.work.name}</span>
			<Email>{props.work.mail}</Email>
		</div>
	);

	return (
		<section class="font-jakarta flex w-full flex-col gap-8">
			<div class="flex flex-col gap-2 text-lg">
				<h2 class="text-text-minor">{t("work.title")}</h2>
				<span class="text-text-major">
					{done().length} {t("work.outof")} {props.detail.works.length}
				</span>
			</div>
			<Show when={done().length}>
				<div class="flex flex-col gap-4">
					<h2 class="font-jakarta text-text-minor text-lg">{t("work.done")}</h2>
					<div class="flex flex-col gap-4">
						<For each={done()}>{(work) => <Done work={work}></Done>}</For>
					</div>
				</div>
			</Show>
			<Show when={ongo().length}>
				<div class="flex flex-col gap-4">
					<h2 class="font-jakarta text-text-minor text-lg">{t("work.ongo")}</h2>
					<div class="flex flex-col gap-4">
						<For each={ongo()}>{(work) => <Ongo work={work}></Ongo>}</For>
					</div>
				</div>
			</Show>
		</section>
	);
};
