import { Navigate } from "@solidjs/router";
import { createResource, JSXElement, Suspense } from "solid-js";
import { authorized } from "../api/auth.api";

export default (props: { children: JSXElement }) => {
	const [auth] = createResource(authorized, { initialValue: false });

	return <Suspense>{auth() ? <Navigate href="/app"></Navigate> : props.children}</Suspense>;
};
