import { defineConfig } from "vite";

import tailwindCSS from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig(({ mode }) => {
	const DEV = mode === "DEV";

	return {
		plugins: [tailwindCSS(), solidPlugin()],

		build: {
			target: "esnext",
			emptyOutDir: true,
			outDir: "../server/public",

			minify: DEV ? "esbuild" : "terser",
			cssMinify: DEV ? "esbuild" : "lightningcss",
		},
	};
});
