import { GetTaskResults } from "@app/schema";
import { useParams } from "@solidjs/router";
import { createMemo, For, Match, Setter, Show, Switch } from "solid-js";
import { getUserWorkFile, setWorkComm, setWorkDone } from "../../api/task.api";
import Button1 from "../../gui/Button1";
import Form from "../../gui/Form";
import Modal from "../../gui/Modal";
import TextArea from "../../gui/TextArea";
import Email from "../Email";
import I18n from "./I18n";

type GetDetail<A extends boolean> = Extract<GetTaskResults, { auth: A }>;

export default (props: { detail: GetTaskResults; mutate: Setter<GetTaskResults> }) => (
	<Switch>
		<Match when={props.detail.auth}>
			<AuthView detail={props.detail as GetDetail<true>}></AuthView>
		</Match>
		<Match when={!props.detail.auth}>
			<MembView
				detail={props.detail as GetDetail<false>}
				mutate={props.mutate}
			></MembView>
		</Match>
	</Switch>
);

const AuthView = (props: { detail: GetDetail<true> }) => {
	const t = I18n.useI18n();

	const done = createMemo(() => props.detail.works.filter((w) => w.done));
	const ongo = createMemo(() => props.detail.works.filter((w) => !w.done));

	const Done = (props: { work: GetDetail<true>["works"][number] }) => {
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
						{t("grade.work")}
					</a>
				</Show>
				<Feedback mail={props.work.mail}></Feedback>
			</div>
		);
	};
	const Ongo = (props: { work: GetDetail<true>["works"][number] }) => (
		<div class="border-border font-jakarta flex w-full flex-wrap items-center gap-4 rounded-xl border-1 p-3.5 text-lg">
			<span class="text-text-major mr-auto text-lg">{props.work.name}</span>
			<Email>{props.work.mail}</Email>
		</div>
	);

	const Feedback = (props: { mail: string }) => {
		const t = I18n.useI18n();
		const { aid } = useParams();

		let toggle!: HTMLButtonElement;

		return (
			<>
				<button
					ref={toggle}
					type="button"
					title={t("grade.ctoa")}
					class="h-6 cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="stroke-text-minor h-full fill-none stroke-[1.5]"
					>
						<path d="m15.5 5.5 2.8 2.8M3 21v-.3l.5-2.3.7-1.4c.3-.5.7-.9 1.6-1.8L17.4 3.6c.8-.8 2.1-.8 2.8 0 .8.8.8 2 0 2.8L8.4 18.3l-1.6 1.4-1.2.7-2.1.5-.5.1z" />
					</svg>
				</button>
				<Modal toggle={toggle}>
					<Form
						label={t("grade.next")}
						cback={(comment) => {
							void setWorkComm(
								{ aid },
								{ mail: props.mail, comm: comment.trim().length ? comment : undefined },
							);
							window.dispatchEvent(new Event("$close-modal"));
						}}
					>
						<TextArea name={t("grade.comm")}>test</TextArea>
					</Form>
				</Modal>
			</>
		);
	};

	return (
		<section class="font-jakarta flex w-full flex-col gap-8">
			<div class="flex flex-col gap-2 text-lg">
				<h2 class="text-text-minor">{t("works")}</h2>
				<span class="text-text-major">
					{done().length} {t("outof")} {props.detail.works.length}
				</span>
			</div>
			<Show when={done().length}>
				<div class="flex flex-col gap-4">
					<h2 class="font-jakarta text-text-minor text-lg">{t("status.done")}</h2>
					<div class="flex flex-col gap-4">
						<For each={done()}>{(work) => <Done work={work}></Done>}</For>
					</div>
				</div>
			</Show>
			<Show when={ongo().length}>
				<div class="flex flex-col gap-4">
					<h2 class="font-jakarta text-text-minor text-lg">{t("status.ongo")}</h2>
					<div class="flex flex-col gap-4">
						<For each={ongo()}>{(work) => <Ongo work={work}></Ongo>}</For>
					</div>
				</div>
			</Show>
		</section>
	);
};

const MembView = (props: { detail: GetDetail<false>; mutate: Setter<GetTaskResults> }) => {
	const t = I18n.useI18n();
	const { aid } = useParams();

	return (
		<section class="font-jakarta flex w-full flex-col gap-8">
			<Show when={props.detail.work.done}>
				<div class="flex flex-col gap-2 text-lg">
					<h2 class="text-text-minor">Comments</h2>
					<Show
						when={props.detail.work.comm}
						fallback={<span class="text-holder">{t("none")}</span>}
					>
						<span class="text-text-major whitespace-pre-wrap">{props.detail.work.comm}</span>
					</Show>
				</div>
			</Show>
			<Button1
				onclick={() => {
					const done = !props.detail.work.done;
					void setWorkDone({ aid }, { done });
					props.mutate((old) => {
						if (old.auth) {
							throw new Error("Not A Assignee");
						}
						return { ...old, work: { ...old.work, done } };
					});
				}}
			>
				{props.detail.work.done ? t("revoke") : t("submit")}
			</Button1>
		</section>
	);
};
