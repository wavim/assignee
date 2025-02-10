import { cleanPlugin } from "esbuild-clean-plugin";

export default {
	esbuild: {
		format: "esm",
		bundle: true,
		packages: "external",
		//MO DEV
		minify: false,
		metafile: true,
		plugins: [cleanPlugin()],
	},
};
