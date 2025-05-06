import axios from "axios";
import { createSignal, onMount, Show } from "solid-js";

import Button from "../../../../components/Button/Button";
// import Input from "../../../../components/Input/Input";
import { atoms } from "../../../../effects/atoms";

export default (props: { ref?: any }) => {
	// let toggleButton!: HTMLButtonElement;
	// let emailInput!: HTMLInputElement;

	// const [toggle, setToggle] = createSignal(false);
	// const [emailInputHint, setEmailHint] = createSignal("");

	// let debounce = false;
	// let debounceTimeout!: number;

	// onMount(() => {
	// 	toggleButton.onclick = () => {
	// 		if (debounce) return;
	// 		debounce = true;
	// 		clearTimeout(debounceTimeout);
	// 		debounceTimeout = setTimeout(() => (debounce = false), 500);

	// 		setEmailHint("");

	// 		const ease: gsap.TweenVars = { duration: 0.5, ease: "power3.inOut" };

	// 		if (toggle()) {
	// 			const tl = gsap.timeline({ onComplete: () => void setToggle(false) });

	// 			tl.add(atoms.moveup(emailInput, ease).reverse());
	// 		} else {
	// 			setToggle(true);
	// 			emailInput.focus();

	// 			const tl = gsap.timeline();

	// 			tl.add(atoms.moveup(emailInput, ease));
	// 		}
	// 	};
	// });

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
		<div
			ref={props.ref}
			class="flex items-center"
		>
			<Button
				name="toggle login/signup"
			>
				Login/Signup
			</Button>
			{/* <Show when={toggle()}> */}
			{/* <Input
					type="email"
					name="login/signup email address"
					title="Email Address"
					placeholder="Enter your email address"
					hint={emailInputHint()}
					ref={onEmailInputMount}
					class="ml-8"
					nospellcheck
				></Input> */}
			{/* </Show> */}
		</div>
	);
};
