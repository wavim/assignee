import { GetTasksResults } from "@app/schema";
import Filter from "@wavim/solid-filter";
import clsx from "clsx/lite";
import { createMemo, createResource, createSignal, onCleanup, onMount, Show } from "solid-js";
import stringSimilarity from "string-similarity-js";
import { queryTasks } from "../../../api/task.api";
import { resLocale } from "../../../config/locale";
import Search from "../../../gui/Search";
import Card from "../Card";
import I18n from "./I18n";

export default () => {
	const [tasks] = createResource(queryTasks, { initialValue: [] });

	return (
		<I18n.I18n>
			<main class="flex w-full flex-col gap-8 p-4">
				<Show
					when={tasks().length}
					fallback={
						<p class="font-jakarta fixed top-1/2 -mt-20 self-center text-2xl">
							{I18n.useI18n()("prompt")}
						</p>
					}
				>
					<Dash tasks={tasks()}></Dash>
				</Show>
			</main>
		</I18n.I18n>
	);
};

const Dash = (props: { tasks: GetTasksResults }) => {
	const t = I18n.useI18n();

	type Filter = "curr" | "past" | "done";

	const [search, setSearch] = createSignal("");
	const [filter, setFilter] = createSignal<Filter>("curr");

	const candids = createMemo(() => {
		const tasks = props.tasks.sort((a, b) => a.dead.localeCompare(b.dead));

		return filter() === "done" ? tasks.reverse() : tasks;
	});
	const matches = (search: string, ...targets: string[]) => {
		return targets.some(
			(t) => t.toLowerCase().includes(search) || stringSimilarity(t, search) > 0.5,
		);
	};

	const Picker = (props: { value: Filter; children: string }) => (
		<button
			type="button"
			onclick={() => setFilter(props.value)}
			class={clsx(
				"font-jakarta cursor-pointer rounded-xl p-4 text-lg transition-colors duration-150 ease-out",
				filter() === props.value && "bg-overlay/75",
			)}
		>
			{props.children}
		</button>
	);

	return (
		<>
			<Search search={setSearch}>
				<span>
					<Picker value="curr">{t("curr")}</Picker>
					<Picker value="past">{t("past")}</Picker>
					<Picker value="done">{t("done")}</Picker>
				</span>
			</Search>
			<section class="flex w-full flex-col flex-wrap gap-4 md:flex-row">
				<Filter
					candidates={candids()}
					predicates={[
						({ dead, done }) =>
							filter() === "done"
								? done
								: !done && filter() === (dead > new Date().toISOString() ? "curr" : "past"),
						({ name, team }) => matches(search(), name, team),
					]}
				>
					{(task) => <Task>{task}</Task>}
				</Filter>
			</section>
		</>
	);
};

const Task = (props: { children: GetTasksResults[number] }) => {
	const [locale, setLocale] = createSignal(resLocale());
	const $update = () => setLocale(resLocale());

	onMount(() => {
		window.addEventListener("$update-locale", $update);
	});
	onCleanup(() => {
		window.removeEventListener("$update-locale", $update);
	});

	return (
		<Card
			href={`/task/${props.children.aid}`}
			name={props.children.name}
			desc={props.children.team}
		>
			{new Date(props.children.dead).toLocaleDateString(locale(), { dateStyle: "medium" })}
		</Card>
	);
};
