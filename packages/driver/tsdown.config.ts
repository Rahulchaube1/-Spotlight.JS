import { defineConfig } from "tsdown";

const shared = {
  target: "es2020",
  platform: "browser",
  dts: true,
  minify: true,
  outExtensions: (ctx: { format: string }) =>
    ctx.format === "es" ? { js: ".mjs" } : ctx.format === "cjs" ? { js: ".cjs" } : { js: ".js" },
} as const;

export default defineConfig([
  {
    ...shared,
    entry: { "spotlight.js": "src/spotlight.ts" },
    format: ["es", "cjs", "iife"],
    globalName: "spotlight.js",
    css: {
      fileName: "spotlight.css",
      minify: true,
    },
  },
  {
    ...shared,
    entry: { "driver.js": "src/driver.ts" },
    format: ["es", "cjs", "iife"],
    globalName: "driver.js",
    css: {
      fileName: "driver.css",
      minify: true,
    },
  },
  {
    ...shared,
    entry: { lite: "src/lite.ts" },
    format: ["es", "cjs", "iife"],
    globalName: "spotlightLite",
  },
  {
    ...shared,
    entry: { hints: "src/hints.ts" },
    format: ["es", "cjs", "iife"],
    globalName: "spotlightHints",
    css: {
      fileName: "hints.css",
      minify: true,
    },
  },
  {
    ...shared,
    entry: { checklist: "src/checklist.ts" },
    format: ["es", "cjs", "iife"],
    globalName: "spotlightChecklist",
    deps: { neverBundle: ["spotlight.js", "driver.js"] },
    outputOptions: { globals: { "spotlight.js": "spotlight.js", "driver.js": "driver.js" } },
    css: {
      fileName: "checklist.css",
      minify: true,
    },
  },
]);
