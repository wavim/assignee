import { useNavigate, useParams } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { isAxiosError } from "axios";
import { createResource, Show, Suspense } from "solid-js";
import { getCode } from "../../api/code.api";
import { teamDetail } from "../../api/team.api";
import Guard from "../../gui/Guard";
import { defineI18n } from "../../gui/I18n";
import Footer from "../Footer";
import Header from "./Header";
import Membs from "./Membs/Membs";
import Tasks from "./Tasks/Tasks";

const I18n = defineI18n({
	en: { invite: "Invite Member", code: "Invite Code" },
	zh: { invite: "邀請成員", code: "邀請碼" },
});

export default () => (
	<Guard>
		<Header></Header>
		<I18n.I18n>
			<Suspense>
				<Team></Team>
			</Suspense>
		</I18n.I18n>
		<Footer></Footer>
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
		const t = I18n.useI18n();

		const [code] = createResource(() => getCode(useParams()));

		return (
			<span
				title={t("code")}
				class="text-text-major uppercase"
			>
				{code()?.code}
			</span>
		);
	};

	return (
		<section class="font-jakarta border-border flex w-full flex-col items-baseline gap-4 border-b-1 pb-8">
			<h1 class="text-text-major text-4xl">{props.name}</h1>
			<div class="flex gap-4 text-xl">
				<h2 class="text-text-minor whitespace-pre-wrap">{props.desc}</h2>
				<Show when={props.auth}>
					<Invite></Invite>
				</Show>
			</div>
		</section>
	);
};
