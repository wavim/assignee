import Copyright from "./Copyright/Copyright";
import HomeNav from "./HomeNav/HomeNav";
import I18n from "./I18n";

export default () => {
	return (
		<I18n>
			<footer class="bg-main mt-12 flex w-full flex-col gap-2 p-7">
				<HomeNav></HomeNav>
				<Copyright></Copyright>
			</footer>
		</I18n>
	);
};
