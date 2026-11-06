import { copyFileSync, existsSync } from "node:fs";

if (existsSync("dist/driver.js.d.mts")) {
  copyFileSync("dist/driver.js.d.mts", "dist/driver.js.d.ts");
}
if (existsSync("dist/spotlight.js.d.mts")) {
  copyFileSync("dist/spotlight.js.d.mts", "dist/spotlight.js.d.ts");
}
if (existsSync("dist/hints.d.mts")) {
  copyFileSync("dist/hints.d.mts", "dist/hints.d.ts");
}
if (existsSync("dist/checklist.d.mts")) {
  copyFileSync("dist/checklist.d.mts", "dist/checklist.d.ts");
}
