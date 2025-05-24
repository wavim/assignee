import { cleanPlugin } from "esbuild-clean-plugin";

export default {
	esbuild: {
		format: "cjs",
		bundle: true,
		packages: "external",
		outExtension: {
			".js": ".cjs",
		},
		minify: true,
		metafile: true,

		plugins: [cleanPlugin()],
	},
};
