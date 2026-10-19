import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "wheel.html");
console.log("wrote wheel.html");
