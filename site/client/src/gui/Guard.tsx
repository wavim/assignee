import { Navigate } from "@solidjs/router";
import { createResource, JSXElement, Suspense } from "solid-js";
import { rotate } from "../api/auth.api";

export default (props: { landing?: boolean; children: JSXElement }) => {
	const [auth] = createResource(rotate, { initialValue: !props.landing });

	return (
		<Suspense>
			{auth() && props.landing ? (
				<Navigate href="/app"></Navigate>
			) : !auth() && !props.landing ? (
				<Navigate href="/"></Navigate>
			) : (
				props.children
			)}
		</Suspense>
	);
};
