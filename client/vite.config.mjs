import { defineConfig } from "vite";

import tailwindCSS from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [tailwindCSS(), solidPlugin()],

	build: {
		target: "esnext",

		emptyOutDir: true,
		outDir: "../server/public",

		minify: "terser",
		cssMinify: "lightningcss",
	},
});
