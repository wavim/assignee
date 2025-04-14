import { defineConfig } from "vite";

import tailwindCSS from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [solidPlugin(), tailwindCSS()],
	server: { port: 3000 },
	build: {
		outDir: "../backend/public",
		emptyOutDir: true,
		target: "esnext",
		//MO DEV minify off
		minify: false,
		cssMinify: false,
	},
});
