import { GetTaskResults } from "@app/schema";
import { useParams } from "@solidjs/router";
import { Setter, Show } from "solid-js";
import { setWorkDone } from "../../../api/task.api";
import Button1 from "../../../gui/Button1";
import I18n from "../I18n";

export default (props: {
	detail: Extract<GetTaskResults, { auth: false }>;
	mutate: Setter<GetTaskResults>;
}) => {
	const t = I18n.useI18n();
	const { aid } = useParams();

	return (
		<section class="font-jakarta flex w-full flex-col gap-8">
			<Show when={props.detail.work.done}>
				<div class="flex flex-col gap-2 text-lg">
					<h2 class="text-text-minor">{t("work.comm.comm")}</h2>
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
				class="mt-2"
			>
				{props.detail.work.done ? t("work.revoke") : t("work.submit")}
			</Button1>
		</section>
	);
};
