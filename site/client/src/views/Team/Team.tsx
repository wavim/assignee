import { useParams } from "@solidjs/router";
import { JSXElement } from "solid-js";
import Guard from "../../gui/Guard";

export default () => {
	const params = useParams();

	return <Guard>{params.hash}</Guard>;
};

// const Membership = (props: { children: JSXElement }) => {
// 	if (import.meta.env.DEV) {
// 		return props.children;
// 	}

// 	const [auth] = createResource(rotate, { initialValue: !props.landing });

// 	return (
// 		<Suspense>
// 			{auth() && props.landing ? (
// 				<Navigate href="/home"></Navigate>
// 			) : !auth() && !props.landing ? (
// 				<Navigate href="/"></Navigate>
// 			) : (
// 				props.children
// 			)}
// 		</Suspense>
// 	);
// };
