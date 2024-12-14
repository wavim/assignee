import { cleanPlugin } from "esbuild-clean-plugin";

export default {
	esbuild: {
		format: "esm",
		//MO DEV
		minify: false,
		metafile: true,
		plugins: [cleanPlugin()],
	},
};
