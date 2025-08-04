import { Navigate } from "@solidjs/router";
import { createResource, JSXElement, Suspense } from "solid-js";
import { rotate } from "../api/auth.api";

export default (props: { children: JSXElement }) => {
	const [auth] = createResource(rotate, { initialValue: true });

	return <Suspense>{auth() ? props.children : <Navigate href="/"></Navigate>}</Suspense>;
};
