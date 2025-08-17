import { GetTeamResults } from "@app/schema";
import { For } from "solid-js";
import Badge from "../../Badge";
import Email from "../../Email";
import I18n from "./I18n";

export default (props: { members: GetTeamResults["members"] }) => (
	<I18n.I18n>
		<section class="flex min-h-40 w-full flex-1/2 flex-col gap-4">
			<h1 class="font-jakarta text-text-major mb-4 text-2xl">{I18n.useI18n()("membs")}</h1>
			<For
				each={props.members
					.sort((a, b) => a.name.localeCompare(b.name))
					.sort((a, b) => +b.auth - +a.auth)}
			>
				{(member) => <Member>{member}</Member>}
			</For>
		</section>
	</I18n.I18n>
);

const Member = (props: { children: GetTeamResults["members"][number] }) => (
	<div class="border-border font-jakarta flex items-center gap-4 rounded-xl border-1 p-3.5">
		<Badge
			auth={props.children.auth}
			class="h-6"
		></Badge>
		<span class="text-text-major mr-auto text-lg">{props.children.name}</span>
		<Email>{props.children.mail}</Email>
	</div>
);
