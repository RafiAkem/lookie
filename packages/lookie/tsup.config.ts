import { defineConfig } from "tsup";

export default defineConfig({
  entry: { lookie: "src/index.ts" },
  format: ["esm", "iife"],
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".js" };
  },
  globalName: "Lookie",
  minify: true,
  dts: true,
  target: "es2019",
  sourcemap: false,
  clean: true,
});