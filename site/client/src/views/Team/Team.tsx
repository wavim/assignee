import { useNavigate, useParams } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { isAxiosError } from "axios";
import { createResource, For, Show, Suspense } from "solid-js";
import { teamDetail } from "../../api/teams.api";
import Button from "../../gui/Button";
import Guard from "../../gui/Guard";
import { defineI18n } from "../../gui/I18n";
import Modal from "../../gui/Modal";
import Badge from "../Badge";
import Footer from "../Footer";
import Header from "./Header";
import Members from "./Members";

const I18n = defineI18n({
	en: { invite: "Invite Member", code: "Invite Code" },
	zh: { invite: "邀請成員", code: "邀請碼" },
});

export default () => (
	<Guard>
		<Header></Header>
		<Suspense>
			<I18n.I18n>
				<Team></Team>
			</I18n.I18n>
		</Suspense>
		<Footer></Footer>
	</Guard>
);

const Team = () => {
	const navigate = useNavigate();

	const [data] = createResource(
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
		<main class="flex w-full flex-col gap-8 p-8">
			<Banner
				name={data().name}
				desc={data().desc}
			></Banner>
			<div class="flex">
				<Members members={data().members}></Members>
				<section></section>
			</div>
			<Show when={data().auth}>
				<Invite></Invite>
			</Show>
		</main>
	);
};

const Banner = (props: { name: string; desc: string }) => (
	<section class="font-jakarta w-full">
		<h1 class="text-text-major text-3xl">{props.name}</h1>
		<h2 class="text-text-minor text-2xl">{props.desc}</h2>
	</section>
);

const Invite = () => {
	const t = I18n.useI18n();

	let toggle!: HTMLButtonElement;

	// const [code] = createResource(() => invite(useParams()), { initialValue: { code: "" } });

	return (
		<>
			<Button
				ref={toggle}
				class="ml-1"
			>
				{t("invite")}
			</Button>
			<Modal
				toggle={toggle}
				class="font-jakarta flex flex-col gap-4"
			>
				<p class="text-text-major text-xl">{t("code")}</p>
				<span class="text-text-major border-border cursor-text rounded-xl border-1 p-4 text-center text-4xl">
					{/* {code().code} */}
				</span>
			</Modal>
		</>
	);
};
