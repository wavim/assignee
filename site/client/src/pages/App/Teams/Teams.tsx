import { A } from "@solidjs/router";
import Filter from "@wavim/solid-filter";
import clsx from "clsx/lite";
import { createSignal } from "solid-js";
import { SetStoreFunction } from "solid-js/store/types/server.js";
import { stringSimilarity } from "string-similarity-js";
import { defineI18n } from "../../../gui/I18n";
import Input from "../../../gui/Input";
import { Props } from "../../../types/props";
import { Status } from "../../../types/status";
import { sort } from "../../../utils/sort";
import Button from "../../../gui/Button";
import Modal from "../../../gui/Modal";

const I18n = defineI18n({
	en: {
		bar: { search: "Search", normal: "Normal View", badged: "Badged View" },
		owner: "Owner",
		member: "Member",
	},
	zh: {
		bar: { search: "搜索", normal: "普通視圖", badged: "群主視圖" },
		owner: "群主",
		member: "群員",
	},
});

export default (props: { status: Status; update: SetStoreFunction<Status> }) => {
	// MO DEV
	const members = [
		{ tid: 1, Team: { name: "Maths", desc: "Discovering the truth." }, auth: true },
		{ tid: 2, Team: { name: "Philo", desc: "Beauty lies everywhere." }, auth: true },
		{ tid: 3, Team: { name: "Literature", desc: "I suck at literature." }, auth: false },
	];

	return (
		<I18n.I18n>
			<main class="flex w-full flex-col gap-4 p-4">
				<List members={members}></List>
				<Create></Create>
			</main>
		</I18n.I18n>
	);
};

const List = (props: { members: Status["members"] }) => {
	const t = I18n.useI18n();

	const [search, setSearch] = createSignal("");
	const [badged, setBadged] = createSignal(false);

	const matches = (search: string, ...targets: string[]) => {
		return targets.some(
			(t) => t.toLowerCase().startsWith(search) || stringSimilarity(t, search) > 0.5,
		);
	};

	const Bar = () => (
		<div class="flex">
			<Input
				name={t("bar.search")}
				oninput={(ev) => {
					setSearch(ev.target.value.toLowerCase());
				}}
				class="flex-1"
				spellcheck="false"
				autocomplete="off"
			></Input>
			<button
				type="button"
				onclick={() => setBadged(!badged())}
				title={badged() ? t("bar.normal") : t("bar.badged")}
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
		</div>
	);

	return (
		<>
			<Bar></Bar>
			<div class="flex w-full flex-col flex-wrap gap-4 md:flex-row">
				<Filter
					candidates={sort(props.members, (m) => m.Team.name)}
					predicates={[
						({ auth }) => !badged() || auth,
						({ Team }) => matches(search(), Team.name, Team.desc),
					]}
				>
					{(member) => <Card>{member}</Card>}
				</Filter>
			</div>
		</>
	);
};

const Card = (props: { children: Status["members"][number] }) => {
	const t = I18n.useI18n();

	return (
		<A
			href={"/teams/" + String(props.children.tid)}
			class="font-jakarta border-border block w-full rounded-lg border-1 p-4 text-left break-all md:w-[calc(50%-.5rem)]"
		>
			<h1 class="text-text-major text-xl font-medium">{props.children.Team.name}</h1>
			<h2 class="text-text-minor text-lg">{props.children.Team.desc}</h2>
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

const Badge = (props: Props<"div"> & { auth: boolean }) => (
	<div {...props}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="stroke-text-minor h-full fill-none stroke-2"
		>
			{props.auth ? (
				<path d="m9 12 2 2 4-4m-3-7 2 1.9 2.5-.7.7 2.6 2.6.7-.7 2.6L21 12l-1.9 2 .7 2.5-2.6.7-.7 2.6-2.6-.7L12 21l-2-1.9-2.5.7-.7-2.6-2.6-.7.7-2.6L3 12l1.9-2-.7-2.5 2.6-.7.7-2.6 2.6.7L12 3z" />
			) : (
				<path d="m7.5 11.8L12 14l7-3.5M7.5 11.8v6m0-6L12 9.6m-4.5 2.2L5 10.5m2.5 7.3V21m0-3.2L12 20l7-3.5v-6M7.5 17.8 5 16.5v-6m14 0 3-1.5-10-5L2 9l3 1.5" />
			)}
		</svg>
	</div>
);

const Create = () => {
	let toggle!: HTMLButtonElement;

	return (
		<>
			<Button
				ref={toggle}
				class=""
			>
				Create Team
			</Button>
			<Modal toggle={toggle}>Test</Modal>
		</>
	);
};
