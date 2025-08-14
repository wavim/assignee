import { useNavigate, useParams } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { isAxiosError } from "axios";
import { createResource, For, Show, Suspense } from "solid-js";
import { details, invite } from "../../api/team.api";
import Button from "../../gui/Button";
import Guard from "../../gui/Guard";
import { defineI18n } from "../../gui/I18n";
import Modal from "../../gui/Modal";
import Badge from "../Badge";
import Footer from "../Footer";
import Header from "./Header";

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

	const [data] = createResource(async () => {
		try {
			return await details(useParams());
		} catch (e) {
			if (!isAxiosError(e) || !e.response) {
				throw new Error("Internal System Error");
			}
			if ((e.response.status as ErrorCode) === ErrorCode.FORBIDDEN) {
				navigate("/dash", { replace: true });
			} else {
				return { auth: false, name: e.name, desc: e.message, memb: [] };
			}
		}
	});

	return (
		<main class="flex w-full flex-col gap-8 p-8">
			<section class="font-jakarta w-full">
				<h1 class="text-text-major text-3xl">{data()?.name}</h1>
				<h2 class="text-text-minor text-2xl">{data()?.desc}</h2>
			</section>
			<div class="flex">
				<section class="flex w-full flex-col gap-2">
					<For
						each={data()
							?.memb.sort((a, b) => a.name.localeCompare(b.name))
							.sort((a, b) => +b.auth - +a.auth)}
					>
						{(m) => (
							<div class="border-border font-jakarta flex items-center gap-4 rounded-lg border-1 p-4">
								<Badge
									auth={m.auth}
									class="h-6"
								></Badge>
								<span class="text-text-major text-lg">{m.name}</span>
								<a
									href={"mailto:" + m.mail}
									class="ml-auto h-6"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="stroke-text-minor h-full fill-none stroke-2"
									>
										<path d="m3 8 5.4 3.6c1.3.9 2 1.3 2.7 1.5a4 4 0 0 0 1.8 0 9 9 0 0 0 2.7-1.5L21 8M6.2 19h11.6c1.1 0 1.7 0 2.1-.2.4-.2.7-.5.9-.9.2-.4.2-1 .2-2.1V8.2c0-1.1 0-1.7-.2-2.1a2 2 0 0 0-.9-.9c-.4-.2-1-.2-2.1-.2H6.2c-1.1 0-1.7 0-2.1.2a2 2 0 0 0-.9.9C3 6.5 3 7 3 8.2v7.6c0 1.1 0 1.7.2 2.1.2.4.5.7.9.9.4.2 1 .2 2.1.2Z" />
									</svg>
								</a>
							</div>
						)}
					</For>
				</section>
				<section></section>
			</div>
			<Show when={data()?.auth}>
				<Invite></Invite>
			</Show>
		</main>
	);
};

const Invite = () => {
	const t = I18n.useI18n();

	let toggle!: HTMLButtonElement;

	const [code] = createResource(() => invite(useParams()), { initialValue: { code: "" } });

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
				<span class="text-text-major border-border rounded-xl border-1 p-4 text-center text-4xl">
					{code().code}
				</span>
			</Modal>
		</>
	);
};
