import { GetTeamsResults } from "@app/schema";
import { A } from "@solidjs/router";
import Filter from "@wavim/solid-filter";
import clsx from "clsx/lite";
import { createResource, createSignal, Show } from "solid-js";
import { stringSimilarity } from "string-similarity-js";
import { queryTeams } from "../../../api/teams.api";
import Input from "../../../gui/Input";
import Badge from "../../Badge";
import Accept from "./Accept";
import Create from "./Create";
import I18n from "./I18n";

export default () => {
	const [teams] = createResource(queryTeams, { initialValue: [] });

	return (
		<I18n.I18n>
			<main class="flex w-full flex-col gap-8 p-4">
				<Show when={teams().length}>
					<Dash teams={teams()}></Dash>
				</Show>
				<div
					class={clsx(
						"ml-1 flex gap-6",
						!teams().length && "fixed top-[calc(50%-.5rem)] self-center",
					)}
				>
					<Create></Create>
					<Accept></Accept>
				</div>
			</main>
		</I18n.I18n>
	);
};

const Dash = (props: { teams: GetTeamsResults }) => {
	const t = I18n.useI18n();

	const [search, setSearch] = createSignal("");
	const [badged, setBadged] = createSignal(false);

	const matches = (search: string, ...targets: string[]) => {
		return targets.some(
			(t) => t.toLowerCase().startsWith(search) || stringSimilarity(t, search) > 0.5,
		);
	};

	const Search = () => (
		<search>
			<form class="flex">
				<Input
					name={t("search.name")}
					oninput={(ev) => {
						setSearch(ev.target.value.toLowerCase());
					}}
					spellcheck="false"
					autocomplete="off"
					class="flex-1"
				></Input>
				<button
					type="button"
					onclick={() => setBadged(!badged())}
					title={badged() ? t("search.normal") : t("search.badged")}
					class={clsx(
						"ml-2 flex aspect-square h-15 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-150 ease-out",
						badged() && "bg-overlay/75",
					)}
				>
					<Badge
						auth
						class="h-1/2"
					></Badge>
				</button>
			</form>
		</search>
	);

	return (
		<>
			<Search></Search>
			<section class="flex w-full flex-col flex-wrap gap-4 md:flex-row">
				<Filter
					candidates={props.teams.sort((a, b) => a.name.localeCompare(b.name))}
					predicates={[
						({ auth }) => !badged() || auth,
						({ name, desc }) => matches(search(), name, desc),
					]}
				>
					{(team) => <Card>{team}</Card>}
				</Filter>
			</section>
		</>
	);
};

const Card = (props: { children: GetTeamsResults[number] }) => {
	const t = I18n.useI18n();

	return (
		<A
			href={`/team/${props.children.tid}`}
			class="font-jakarta border-border block w-full rounded-lg border-1 p-4 text-left break-all md:w-[calc(50%-.5rem)]"
		>
			<h1 class="text-text-major text-xl font-medium">{props.children.name}</h1>
			<h2 class="text-text-minor text-lg">{props.children.desc}</h2>
			<div class="mt-8 flex items-center gap-2">
				<Badge
					auth={props.children.auth}
					class="h-6"
				></Badge>
				<span class="text-text-minor text-lg">
					{props.children.auth ? t("owner") : t("member")}
				</span>
			</div>
		</A>
	);
};
