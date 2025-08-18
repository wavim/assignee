import { GetTaskResults } from "@app/schema";
import { Setter, Show } from "solid-js";
import I18n from "../I18n";
import TaskFile from "./TaskFile";
import WorkFile from "./WorkFile";

export default (props: { detail: GetTaskResults; mutate: Setter<GetTaskResults> }) => (
	<section class="font-jakarta flex w-full flex-col gap-8">
		<div class="flex flex-col gap-2 text-lg">
			<h2 class="text-text-minor">{I18n.useI18n()("dash.desc")}</h2>
			<span class="text-text-major whitespace-pre-wrap">{props.detail.desc}</span>
		</div>
		<Show when={props.detail.auth || props.detail.file}>
			<TaskFile
				detail={props.detail}
				mutate={props.mutate}
			></TaskFile>
		</Show>
		<Show when={!props.detail.auth}>
			<WorkFile
				detail={props.detail as Extract<GetTaskResults, { auth: false }>}
				mutate={props.mutate}
			></WorkFile>
		</Show>
	</section>
);
