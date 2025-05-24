import { defineConfig } from "vite";

import tailwindCSS from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [tailwindCSS(), solidPlugin()],
	build: {
		target: "esnext",
		emptyOutDir: true,
		outDir: "../backend/public",
		minify: "terser",
		cssMinify: "lightningcss",
	},
});
