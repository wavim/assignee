import { GetTasksResults } from "@app/schema";
import { createResource, createSignal, onCleanup, onMount } from "solid-js";
import { queryTasks } from "../../../api/task.api";
import { resLocale } from "../../../config/locale";
import Tasks from "../../Tasks";
import Card from "../Card";
import I18n from "./I18n";

export default () => {
	const [tasks] = createResource(queryTasks, { initialValue: [] });

	return (
		<I18n.I18n>
			<main class="flex w-full flex-col gap-8 p-4 md:px-8">
				<Tasks tasks={tasks()}>{(task) => <Task>{task}</Task>}</Tasks>
			</main>
		</I18n.I18n>
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
