import { zMembership } from "@app/schema";
import { A } from "@solidjs/router";
import Filter from "@wavim/solid-filter";
import clsx from "clsx/lite";
import { createResource, createSignal, Show } from "solid-js";
import { stringSimilarity } from "string-similarity-js";
import { membership } from "../../../../api/user.api";
import Input from "../../../../gui/Input";
import Badge from "../../Badge";
import Accept from "./Accept";
import Create from "./Create";
import I18n from "./I18n";

export default () => {
	const [members] = createResource(membership, { initialValue: [] });

	return (
		<I18n.I18n>
			<main class="flex w-full flex-col gap-8 p-4">
				<Show when={members().length}>
					<Dash members={members()}></Dash>
				</Show>
				<div
					class={clsx(
						"ml-1 flex flex-col gap-6 md:flex-row",
						!members().length && "fixed inset-1/2 size-max -translate-1/2",
					)}
				>
					<Create></Create>
					<Accept></Accept>
				</div>
			</main>
		</I18n.I18n>
	);
};

const Dash = (props: { members: zMembership }) => {
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
					candidates={props.members.toSorted((a, b) => {
						return a.name.localeCompare(b.name);
					})}
					predicates={[
						({ auth }) => !badged() || auth,
						({ name, desc }) => matches(search(), name, desc),
					]}
				>
					{(member) => <Card>{member}</Card>}
				</Filter>
			</section>
		</>
	);
};

const Card = (props: { children: zMembership[number] }) => {
	const t = I18n.useI18n();

	return (
		<A
			href={"/team/" + props.children.hash}
			class="font-jakarta border-border block w-full rounded-lg border-1 p-4 text-left break-all md:w-[calc(50%-.5rem)]"
		>
			<h1 class="text-text-major text-xl font-medium">{props.children.name}</h1>
			<h2 class="text-text-minor text-lg">{props.children.desc}</h2>
			<div class="mt-8 flex items-center gap-2">
				<Badge
					auth={props.children.auth}
					class="inline h-6"
				></Badge>
				<p class="text-text-minor inline text-lg">
					{props.children.auth ? t("owner") : t("member")}
				</p>
			</div>
		</A>
	);
};
