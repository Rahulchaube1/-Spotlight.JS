import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import compress from "astro-compress";

// Import the library straight from source (../src) so changes to driver.js are
// reflected instantly with HMR — no build step in between. The CSS subpath is
// aliased separately, and listed first so it matches before the bare specifier.
const spotlightSource = fileURLToPath(new URL("../../packages/driver/src/spotlight.ts", import.meta.url));
const spotlightCss = fileURLToPath(new URL("../../packages/driver/src/spotlight.css", import.meta.url));
const driverSource = fileURLToPath(new URL("../../packages/driver/src/driver.ts", import.meta.url));
const driverCss = fileURLToPath(new URL("../../packages/driver/src/driver.css", import.meta.url));
const hintsSource = fileURLToPath(new URL("../../packages/driver/src/hints.ts", import.meta.url));
const hintsCss = fileURLToPath(new URL("../../packages/driver/src/hints.css", import.meta.url));
const checklistSource = fileURLToPath(new URL("../../packages/driver/src/checklist.ts", import.meta.url));
const checklistCss = fileURLToPath(new URL("../../packages/driver/src/checklist.css", import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://Spotlightjs.rahulchaube1.com",
  build: {
    format: "file",
  },
  // Example pages that were merged into grouped pages.
  redirects: {
    "/docs/animated-tour": "/docs/tour-basics#animated-tour",
    "/docs/static-tour": "/docs/tour-basics#static-tour",
    "/docs/tour-progress": "/docs/tour-basics#tour-progress",
    "/docs/interactive-tour": "/docs/interactive-tours",
    "/docs/async-tour": "/docs/interactive-tours#async-steps",
    "/docs/multi-page-tour": "/docs/interactive-tours#multi-page-tours",
    "/docs/confirm-on-exit": "/docs/ending-a-tour#confirm-on-exit",
    "/docs/prevent-destroy": "/docs/ending-a-tour#prevent-exit",
    "/docs/popover-position": "/docs/popover#position",
    "/docs/buttons": "/docs/popover#buttons",
    "/docs/styling-popover": "/docs/styling#popover",
    "/docs/styling-overlay": "/docs/styling#overlay",
    "/docs/styling-hints": "/docs/hints#styling",
  },
  markdown: {
    // Use the pure-JS unified/remark processor instead of Astro 7's default
    // native Sätteri engine, whose prebuilt binary needs a newer glibc than
    // some build hosts provide. With this processor the native binary is never
    // loaded, so the build runs anywhere.
    processor: unified(),
    shikiConfig: {
      theme: "monokai",
    },
  },

  integrations: [
    react(),
    mdx(),
    sitemap(),
    compress({
      CSS: false,
      JS: false,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        { find: "spotlight.js/dist/spotlight.css", replacement: spotlightCss },
        { find: "spotlight.js/spotlight.css", replacement: spotlightCss },
        { find: "spotlight.js/dist/hints.css", replacement: hintsCss },
        { find: "spotlight.js/dist/checklist.css", replacement: checklistCss },
        { find: "spotlight.js/hints", replacement: hintsSource },
        { find: "spotlight.js/checklist", replacement: checklistSource },
        { find: "spotlight.js", replacement: spotlightSource },
        { find: "driver.js/dist/driver.css", replacement: driverCss },
        { find: "driver.js/dist/hints.css", replacement: hintsCss },
        { find: "driver.js/dist/checklist.css", replacement: checklistCss },
        { find: "driver.js/hints", replacement: hintsSource },
        { find: "driver.js/checklist", replacement: checklistSource },
        { find: "driver.js", replacement: driverSource },
      ],
    },
    server: {
      fs: {
        // Allow importing the library source that lives outside this project.
        allow: ["../.."],
      },
    },
  },
});
