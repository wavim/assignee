import { Navigate } from "@solidjs/router";
import { createResource, JSXElement, Show } from "solid-js";
import { verify } from "../api/users.api";

export default (props: { landing?: boolean; children: JSXElement }) => {
	if (import.meta.env.DEV) {
		return props.children;
	}

	const [auth] = createResource(verify);

	return (
		<Show when={!auth.loading}>
			{auth() && props.landing ? (
				<Navigate href="/dash"></Navigate>
			) : !auth() && !props.landing ? (
				<Navigate href="/"></Navigate>
			) : (
				props.children
			)}
		</Show>
	);
};
