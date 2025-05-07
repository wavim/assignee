import { cleanPlugin } from "esbuild-clean-plugin";

export default {
	esbuild: {
		format: "esm",
		packages: "external",
		bundle: true,
		minify: true,
		metafile: true,
		plugins: [cleanPlugin()],
	},
};
