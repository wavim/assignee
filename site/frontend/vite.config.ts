import { defineConfig } from "vite";

import tailwindCSS from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [solidPlugin(), tailwindCSS()],
	build: { target: "esnext", outDir: "../backend/public", emptyOutDir: true },
});
