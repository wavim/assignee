import Login from "./Login/Login";

export default () => {
	return (
		<section class="flex justify-around">
			<div class="flex w-full flex-col gap-7 px-7 pt-24">
				<h1 class="font-jakarta text-text-primary w-4/5 text-4xl">
					Your simplest app for assignments
				</h1>
				<p class="font-jakarta text-text-secondary w-full text-xl">
					Assign, return and grade with utmost ease – from business to school to
					hobbies and more
				</p>
				<Login></Login>
			</div>
		</section>
	);
};
