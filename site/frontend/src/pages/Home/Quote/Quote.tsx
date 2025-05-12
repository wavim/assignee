import { useI18n } from "../I18n";

export default () => {
	const [t] = useI18n();

	return (
		<section class="bg-quote-bg flex h-max w-full flex-col justify-center gap-4 p-7">
			<blockquote class="font-jakarta text-text-primary max-w-[95%] text-4xl">
				{t("quote.quote")}
			</blockquote>
			<cite class="font-jakarta text-text-secondary text-right text-xl not-italic">
				{t("quote.cite")}
			</cite>
		</section>
	);
};
