import { GetTeamTasksResults } from "@app/schema";
import { A, useParams } from "@solidjs/router";
import { createResource, createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { queryTeamTasks } from "../../../api/task.api";
import { resLocale } from "../../../config/locale";
import Tasks from "../../Tasks";
import Assign from "./Assign";
import I18n from "./I18n";

export default () => {
	const [tasks] = createResource(() => queryTeamTasks(useParams()), {
		initialValue: { auth: false, data: [] },
	});

	return (
		<I18n.I18n>
			<section class="relative flex min-h-40 w-full flex-1/2 flex-col gap-4">
				<h1 class="font-jakarta text-text-major mb-4 text-2xl">{I18n.useI18n()("tasks")}</h1>
				<Switch>
					<Match when={tasks().auth}>
						<Tasks
							auth
							tasks={tasks().data as Extract<GetTeamTasksResults, { auth: true }>["data"]}
						>
							{(task) => <Task>{task}</Task>}
						</Tasks>
						<div
							class={
								tasks().data.length ? "mt-4 self-center" : "absolute top-1/2 mt-12 self-center"
							}
						>
							<Assign></Assign>
						</div>
					</Match>
					<Match when={!tasks().auth}>
						<Tasks tasks={tasks().data as Extract<GetTeamTasksResults, { auth: false }>["data"]}>
							{(task) => <Task>{task}</Task>}
						</Tasks>
					</Match>
				</Switch>
			</section>
		</I18n.I18n>
	);
};

const Task = (props: { children: GetTeamTasksResults["data"][number] }) => {
	const t = I18n.useI18n();

	const [locale, setLocale] = createSignal(resLocale());
	const $update = () => setLocale(resLocale());

	onMount(() => {
		window.addEventListener("$update-locale", $update);
	});
	onCleanup(() => {
		window.removeEventListener("$update-locale", $update);
	});

	return (
		<A
			href={`/task/${props.children.aid}`}
			class="border-border font-jakarta flex w-full flex-wrap items-center gap-4 rounded-xl border-1 p-3.5 text-lg"
		>
			<h2 class="text-text-major">{props.children.name}</h2>
			<span class="ml-auto flex gap-4">
				<span class="text-text-major">
					{new Date(props.children.dead).toLocaleDateString(locale(), { dateStyle: "medium" })}
				</span>
				<Show when={typeof props.children.done === "number"}>
					<span class="text-text-minor min-w-28 text-right">
						{String(props.children.done)} {t("submit")}
					</span>
				</Show>
			</span>
		</A>
	);
};
