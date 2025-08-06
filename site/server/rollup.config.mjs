import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
	input: "src/app.ts",
	plugins: [commonjs(), resolve(), json(), typescript(), terser()],
	output: { file: "out/app.js", format: "cjs" },
	logLevel: "silent",
});
