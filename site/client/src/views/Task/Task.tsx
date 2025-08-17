import { GetTaskResults } from "@app/schema";
import { useNavigate, useParams } from "@solidjs/router";
import { ErrorCode } from "@wvm/http-error";
import { isAxiosError } from "axios";
import { createResource, createSignal, onCleanup, onMount, Setter, Show, Suspense } from "solid-js";
import { taskDetail } from "../../api/task.api";
import { resLocale } from "../../config/locale";
import Guard from "../../gui/Guard";
import Footer from "../Footer";
import Header from "./Header";
import I18n from "./I18n";
import TaskFile from "./TaskFile";
import Work from "./Work";
import WorkFile from "./WorkFile";

export default () => (
	<Guard>
		<Suspense>
			<Task></Task>
		</Suspense>
		<Footer></Footer>
	</Guard>
);

const Task = () => {
	const navigate = useNavigate();

	const [detail, { mutate }] = createResource(
		async () => {
			try {
				return await taskDetail(useParams());
			} catch (e) {
				if (isAxiosError(e) && (e.response?.status as ErrorCode) === ErrorCode.FORBIDDEN) {
					navigate("/dash", { replace: true });
				}
				throw new Error();
			}
		},
		{ initialValue: { tid: "", auth: false, name: "", desc: "", dead: "", work: { done: false } } },
	);

	return (
		<I18n.I18n>
			<Header tid={detail().tid}></Header>
			<main class="flex w-full flex-col gap-8 p-4 md:px-8">
				<Banner
					name={detail().name}
					dead={detail().dead}
				></Banner>
				<div class="flex flex-col gap-8 md:flex-row md:gap-4">
					<Dash
						detail={detail()}
						mutate={mutate}
					></Dash>
					<Work
						detail={detail()}
						mutate={mutate}
					></Work>
				</div>
			</main>
		</I18n.I18n>
	);
};

const Banner = (props: { name: string; dead: string }) => {
	const [locale, setLocale] = createSignal(resLocale());
	const $update = () => setLocale(resLocale());

	onMount(() => {
		window.addEventListener("$update-locale", $update);
	});
	onCleanup(() => {
		window.removeEventListener("$update-locale", $update);
	});

	return (
		<section class="border-border flex w-full flex-col gap-4 border-b-1 pb-8">
			<h1 class="text-text-major text-4xl">{props.name}</h1>
			<p class="text-text-minor text-xl">
				{I18n.useI18n()("due")}{" "}
				{new Date(props.dead).toLocaleDateString(locale(), { dateStyle: "long" })}
			</p>
		</section>
	);
};

const Dash = (props: { detail: GetTaskResults; mutate: Setter<GetTaskResults> }) => {
	const t = I18n.useI18n();

	return (
		<section class="font-jakarta flex w-full flex-col gap-8">
			<div class="flex flex-col gap-2 text-lg">
				<h2 class="text-text-minor">{t("desc")}</h2>
				<span class="text-text-major">{props.detail.desc}</span>
			</div>
			<Show when={props.detail.auth || props.detail.file}>
				<TaskFile
					detail={props.detail}
					mutate={props.mutate}
				></TaskFile>
			</Show>
			<Show when={!props.detail.auth}>
				<WorkFile
					detail={props.detail as Extract<GetTaskResults, { auth: false }>}
					mutate={props.mutate}
				></WorkFile>
			</Show>
		</section>
	);
};
