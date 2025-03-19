import { defineConfig } from "vite";

import solidPlugin from "vite-plugin-solid";
import tailwindCSS from "@tailwindcss/vite";

export default defineConfig({
	plugins: [solidPlugin(), tailwindCSS()],
	server: { port: 3000 },
	build: {
		outDir: "../backend/public",
		emptyOutDir: true,
		target: "esnext",
		//MO DEV minify
		minify: false,
		cssMinify: false,
	},
});
