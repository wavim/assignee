import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [solidPlugin()],
	server: {
		port: 5200,
	},
	build: {
		outDir: "../backend/public",
		emptyOutDir: true,
		target: "esnext",
		//MO DEV
		// cssMinify: true,
	},
});
