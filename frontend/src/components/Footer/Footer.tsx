import Logo from "../Logo/Logo";
import Copyright from "./Copyright/Copyright";
import I18n from "./I18n";

export default () => {
	return (
		<I18n>
			<footer class="bg-main mt-12 flex w-full flex-col gap-2 p-7">
				<Logo class="text-text-primary h-8 w-max"></Logo>
				<Copyright></Copyright>
			</footer>
		</I18n>
	);
};
