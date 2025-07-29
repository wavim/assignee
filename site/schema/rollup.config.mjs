import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig(
  {
    input: "src/index.ts",
    plugins: [
      typescript({
        compilerOptions: {
          declaration: true,
          declarationDir: "./out",
        },
      }),
      resolve(),
      terser(),
    ],
    output: { dir: "out", format: "es" },
  },
);
