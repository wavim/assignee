import axios from "axios";

import Button from "../../../../components/Button/Button";

export default () => {
	// const onEmailInputMount = (ele: HTMLInputElement) => {
	// 	emailInput = ele;

	// 	ele.oninput = async () => {
	// 		ele.setCustomValidity("");

	// 		if (!ele.validity.valid) {
	// 			ele.setCustomValidity("Invalid Email Address");
	// 			setEmailHint("Invalid Email Address");
	// 			return;
	// 		}

	// 		const email = ele.value;
	// 		if (email === "") {
	// 			setEmailHint("");
	// 			return;
	// 		}

	// 		const req = await axios.get(`/api/email/is-free/${email}`);
	// 		const isfree: boolean = req.data;
	// 		setEmailHint(isfree ? "Signup" : "Login");
	// 	};
	// };

	return (
		<div class="flex items-center">
			<Button
				name="get started"
				onclick={() => void 0}
			>
				Get Started
			</Button>
		</div>
	);
};
