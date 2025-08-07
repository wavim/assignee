import { Navigate } from "@solidjs/router";
import { createResource, JSXElement, Suspense } from "solid-js";
import { rotate } from "../api/auth.api";

export default (props: { children: JSXElement; protect?: boolean }) => {
	const [auth] = createResource(rotate, { initialValue: props.protect });

	return (
		<Suspense>
			{auth() ? <Navigate href={props.protect ? "/" : "/app"}></Navigate> : props.children}
		</Suspense>
	);
};
