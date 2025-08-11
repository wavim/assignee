import { Navigate } from "@solidjs/router";
import { createResource, JSXElement, Suspense } from "solid-js";
import { rotate } from "../api/auth.api";

export default (props: { landing?: boolean; children: JSXElement }) => {
	if (import.meta.env.DEV) {
		return props.children;
	}

	const [auth] = createResource(rotate, { initialValue: !props.landing });

	return (
		<Suspense>
			{auth() && props.landing ? (
				<Navigate href="/dash"></Navigate>
			) : !auth() && !props.landing ? (
				<Navigate href="/"></Navigate>
			) : (
				props.children
			)}
		</Suspense>
	);
};
