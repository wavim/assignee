import { Navigate } from "@solidjs/router";
import { createResource, JSXElement, Suspense } from "solid-js";
import { authorized } from "../api/auth.api";

export default (props: { children: JSXElement }) => {
	const [auth] = createResource(authorized, { initialValue: true });

	return <Suspense>{auth() ? props.children : <Navigate href="/"></Navigate>}</Suspense>;
};
