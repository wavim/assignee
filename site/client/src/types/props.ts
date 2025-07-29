import { JSX } from "solid-js";

export type Props<T extends keyof JSX.HTMLElementTags> = JSX.HTMLElementTags[T];
