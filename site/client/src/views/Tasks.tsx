import Filter from "@wavim/solid-filter";
import clsx from "clsx/lite";
import { createMemo, createSignal, JSXElement, Setter, Show } from "solid-js";
import stringSimilarity from "string-similarity-js";
import { defineI18n } from "../gui/I18n";
import Search from "../gui/Search";

interface TaskBase {
	aid: string;
	name: string;
	dead: string;
	done: number | boolean;
}

const I18n = defineI18n({
	en: { none: "Currently, nothing.", curr: "Upcoming", past: "Past Due", done: "Submitted" },
	zh: { none: "暫時，什麼也沒有", curr: "當前任務", past: "逾期任務", done: "已提交" },
});

export default <T extends TaskBase>(props: {
	auth?: boolean;
	tasks: T[];
	children: (task: T) => JSXElement;
}) => {
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
				"font-jakarta text-text-major cursor-pointer rounded-xl border-1 border-transparent p-3.5 text-lg transition-colors duration-150 ease-out",
				filter() === props.value && "bg-overlay/75",
			)}
		>
			{props.children}
		</button>
	);
	const TaskSearch = (props: { auth?: boolean; search: Setter<string> }) => {
		const t = I18n.useI18n();

		return (
			<Search search={props.search}>
				<Show when={!props.auth}>
					<span>
						<Picker value="curr">{t("curr")}</Picker>
						<Picker value="past">{t("past")}</Picker>
						<Picker value="done">{t("done")}</Picker>
					</span>
				</Show>
			</Search>
		);
	};

	return (
		<I18n.I18n>
			<Show
				when={props.tasks.length}
				fallback={
					<h1 class="font-jakarta text-text-major absolute top-1/2 self-center text-2xl">
						{I18n.useI18n()("none")}
					</h1>
				}
			>
				<TaskSearch
					auth={props.auth}
					search={setSearch}
				></TaskSearch>
				<section class="flex w-full flex-col flex-wrap gap-4 md:flex-row">
					<Filter
						candidates={candids()}
						predicates={[
							({ dead, done }) => {
								if (props.auth) {
									return true;
								}
								return filter() === "done"
									? !!done
									: !done && filter() === (dead > new Date().toISOString() ? "curr" : "past");
							},
							(task) =>
								matches(search(), ...Object.values(task).filter((p) => typeof p === "string")),
						]}
					>
						{props.children}
					</Filter>
				</section>
			</Show>
		</I18n.I18n>
	);
};
