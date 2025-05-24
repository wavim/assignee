import { cleanPlugin } from "esbuild-clean-plugin";

export default {
	esbuild: {
		bundle: true,
		format: "cjs",
		metafile: true,
		minify: true,
		outExtension: {
			".js": ".cjs",
		},
		packages: "external",
		plugins: [cleanPlugin()],
	},
};
