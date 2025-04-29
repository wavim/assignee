import gsap from "gsap";
import { createSignal, onMount, Show } from "solid-js";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/TextInput/Input";
import { atoms } from "../../../../effects/atoms";

export default (props: { ref?: any }) => {
	let toggleButton!: HTMLButtonElement;
	let emailInput!: HTMLInputElement;

	const [toggle, setToggle] = createSignal(false);
	const [emailHint, setEmailHint] = createSignal("");

	let debounce = false;
	let debounceTimeout!: number;

	onMount(() => {
		toggleButton.onclick = () => {
			if (debounce) return;
			debounce = true;
			clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(() => (debounce = false), 500);

			setEmailHint("");

			const ease: gsap.TweenVars = { duration: 0.5, ease: "power3.inOut" };

			if (toggle()) {
				const tl = gsap.timeline({ onComplete: () => void setToggle(false) });

				tl.add(atoms.moveup(emailInput, ease).reverse());
			} else {
				setToggle(true);
				emailInput.focus();

				const tl = gsap.timeline();

				tl.add(atoms.moveup(emailInput, ease));
			}
		};
	});

	return (
		<div
			ref={props.ref}
			class="flex items-center"
		>
			<Button
				name="toggle login/signup"
				ref={toggleButton}
			>
				Login/Signup
			</Button>
			<Show when={toggle()}>
				<Input
					type="email"
					name="login/signup email address"
					title="Email Address"
					placeholder="Enter your email address"
					hints={emailHint()}
					ref={(ele: HTMLInputElement) => {
						emailInput = ele;

						ele.oninput = () => {
							ele.setCustomValidity("");
							setEmailHint("");

							if (!ele.validity.valid) {
								ele.setCustomValidity("Invalid Email Address");
								setEmailHint("Invalid Email Address");
							}
						};
					}}
					class="valid:not-placeholder-shown:border-valid-blue invalid:border-invalid-red ml-8"
					nospellcheck
				></Input>
			</Show>
		</div>
	);
};
