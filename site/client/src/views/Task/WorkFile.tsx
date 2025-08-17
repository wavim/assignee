import { GetTaskResults } from "@app/schema";
import { useParams } from "@solidjs/router";
import { Setter, Show } from "solid-js";
import { getWorkFile, setWorkFile } from "../../api/task.api";
import Upload from "../../gui/Upload";
import I18n from "./I18n";

export default (props: {
	detail: Extract<GetTaskResults, { auth: false }>;
	mutate: Setter<GetTaskResults>;
}) => {
	const t = I18n.useI18n();
	const { aid } = useParams();

	return (
		<div class="font-jakarta flex w-full flex-col gap-2 text-lg">
			<h2 class="text-text-minor">{t("work")}</h2>
			<Show
				when={props.detail.work.file}
				fallback={
					<Show when={props.detail.work.done}>
						<span class="text-holder">{t("none")}</span>
					</Show>
				}
			>
				<a
					href={getWorkFile({ aid })}
					download={props.detail.work.file}
					class="text-text-major w-max underline underline-offset-2"
				>
					{props.detail.work.file}
				</a>
			</Show>
			<Show when={!props.detail.work.done}>
				<Upload
					name={t("upload")}
					pick={(file) => {
						if (!file) {
							return;
						}
						void setWorkFile({ aid }, file);
						props.mutate((old) => {
							if (old.auth) {
								throw new Error("Not A Assignee");
							}
							return { ...old, work: { ...old.work, file: file.name } };
						});
					}}
					class="mt-4 w-max"
				></Upload>
			</Show>
		</div>
	);
};
