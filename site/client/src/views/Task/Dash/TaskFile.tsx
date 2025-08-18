import { GetTaskResults } from "@app/schema";
import { useParams } from "@solidjs/router";
import { Setter, Show } from "solid-js";
import { getTaskFile, setTaskFile } from "../../../api/task.api";
import Upload from "../../../gui/Upload";
import I18n from "../I18n";

export default (props: { detail: GetTaskResults; mutate: Setter<GetTaskResults> }) => {
	const t = I18n.useI18n();
	const { aid } = useParams();

	return (
		<div class="font-jakarta flex w-full flex-col gap-2 text-lg">
			<h2 class="text-text-minor">{t("dash.file")}</h2>
			<Show when={props.detail.file}>
				<a
					href={getTaskFile({ aid })}
					download={props.detail.file}
					class="text-text-major w-max underline underline-offset-2"
				>
					{props.detail.file}
				</a>
			</Show>
			<Show when={props.detail.auth}>
				<Upload
					name={t("dash.upload")}
					pick={(file) => {
						if (!file) {
							return;
						}
						void setTaskFile({ aid }, file);
						props.mutate((old) => ({ ...old, file: file.name }));
					}}
					class="mt-4 w-max"
				></Upload>
			</Show>
		</div>
	);
};
