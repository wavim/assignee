import { GetTeamsResults } from "@app/schema";
import Filter from "@wavim/solid-filter";
import clsx from "clsx/lite";
import { createResource, createSignal, Show } from "solid-js";
import { stringSimilarity } from "string-similarity-js";
import { queryTeams } from "../../../api/team.api";
import Search from "../../../gui/Search";
import Badge from "../../Badge";
import Card from "../Card";
import Accept from "./Accept";
import Create from "./Create";
import I18n from "./I18n";

export default () => {
	const [teams] = createResource(queryTeams, { initialValue: [] });

	return (
		<I18n.I18n>
			<main class="flex w-full flex-col gap-8 p-4">
				<Show
					when={teams().length}
					fallback={
						<p class="font-jakarta text-text-major fixed top-1/2 -mt-20 self-center text-2xl">
							{I18n.useI18n()("prompt")}
						</p>
					}
				>
					<Dash teams={teams()}></Dash>
				</Show>
				<div class={clsx("ml-1 flex gap-6", !teams().length && "fixed top-1/2 self-center")}>
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
			(t) => t.toLowerCase().includes(search) || stringSimilarity(t, search) > 0.5,
		);
	};

	return (
		<>
			<Search search={setSearch}>
				<button
					type="button"
					onclick={() => setBadged(!badged())}
					title={badged() ? t("normal") : t("badged")}
					class={clsx(
						"flex aspect-square h-15 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-150 ease-out",
						badged() && "bg-overlay/75",
					)}
				>
					<Badge
						auth
						class="h-1/2"
					></Badge>
				</button>
			</Search>
			<section class="flex w-full flex-col flex-wrap gap-4 md:flex-row">
				<Filter
					candidates={props.teams.sort((a, b) => a.name.localeCompare(b.name))}
					predicates={[
						({ auth }) => !badged() || auth,
						({ name, desc }) => matches(search(), name, desc),
					]}
				>
					{(team) => <Team>{team}</Team>}
				</Filter>
			</section>
		</>
	);
};

const Team = (props: { children: GetTeamsResults[number] }) => {
	const t = I18n.useI18n();

	return (
		<Card
			href={`/team/${props.children.tid}`}
			name={props.children.name}
			desc={props.children.desc}
		>
			<Badge
				auth={props.children.auth}
				class="h-6"
			></Badge>
			<span>{props.children.auth ? t("owner") : t("member")}</span>
		</Card>
	);
};
