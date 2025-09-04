import { useNavigate, useParams } from "@solidjs/router";
import { ErrorCode } from "@wavim/http-error";
import { isAxiosError } from "axios";
import { createResource, Show, Suspense } from "solid-js";
import { getCode } from "../../api/code.api";
import { teamDetail } from "../../api/team.api";
import Guard from "../../gui/Guard";
import Footer from "../Footer";
import Header from "./Header";
import I18n from "./I18n";
import Membs from "./Membs/Membs";
import Tasks from "./Tasks/Tasks";

export default () => (
	<Guard>
		<I18n.I18n>
			<Header></Header>
			<Suspense>
				<Team></Team>
			</Suspense>
			<Footer></Footer>
		</I18n.I18n>
	</Guard>
);

const Team = () => {
	const navigate = useNavigate();

	const [detail] = createResource(
		async () => {
			try {
				return await teamDetail(useParams());
			} catch (e) {
				if (isAxiosError(e) && (e.response?.status as ErrorCode) === ErrorCode.FORBIDDEN) {
					navigate("/dash", { replace: true });
				}
				throw new Error();
			}
		},
		{ initialValue: { name: "", desc: "", auth: false, members: [] } },
	);

	return (
		<main class="flex w-full flex-col gap-8 p-4 md:px-8">
			<Banner
				name={detail().name}
				desc={detail().desc}
				auth={detail().auth}
			></Banner>
			<div class="flex flex-col gap-8 md:flex-row md:gap-4">
				<Tasks></Tasks>
				<Membs members={detail().members}></Membs>
			</div>
		</main>
	);
};

const Banner = (props: { name: string; desc: string; auth: boolean }) => {
	const Invite = () => {
		const [code] = createResource(() => getCode(useParams()));

		return (
			<span
				title={I18n.useI18n()("code")}
				class="text-text-major uppercase"
			>
				{code()?.code}
			</span>
		);
	};

	return (
		<section class="font-jakarta border-border flex w-full flex-col items-baseline gap-4 border-b-1 pb-8">
			<h1 class="text-text-major text-4xl">{props.name}</h1>
			<div class="flex w-full items-end gap-4 text-xl">
				<h2 class="text-text-minor mr-auto whitespace-pre-wrap">{props.desc}</h2>
				<Show when={props.auth}>
					<Invite></Invite>
				</Show>
			</div>
		</section>
	);
};
