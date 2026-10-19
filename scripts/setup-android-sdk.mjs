import { spawnSync } from "node:child_process";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const sdkRoot = join(process.env.LOCALAPPDATA || "", "Android", "Sdk");
const cmdlineToolsZip = join(process.env.TEMP || "", "commandlinetools-win.zip");
const cmdlineToolsUrl =
  "https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip";

mkdirSync(sdkRoot, { recursive: true });

async function download(url, dest) {
  console.log(`Downloading ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    stdio: opts.input ? ["pipe", "inherit", "inherit"] : "inherit",
    shell: true,
    env: opts.env || process.env,
    input: opts.input,
  });
  if (r.status !== 0) throw new Error(`${cmd} failed with ${r.status}`);
}

const toolsBin = join(sdkRoot, "cmdline-tools", "latest", "bin");
const sdkmanager = join(toolsBin, "sdkmanager.bat");

if (!existsSync(sdkmanager)) {
  await download(cmdlineToolsUrl, cmdlineToolsZip);
  const tmp = join(sdkRoot, "_cmdline_tmp");
  const latest = join(sdkRoot, "cmdline-tools", "latest");
  mkdirSync(dirname(latest), { recursive: true });
  run("powershell", [
    "-NoProfile",
    "-Command",
    `Expand-Archive -Force -Path '${cmdlineToolsZip}' -DestinationPath '${tmp}'`,
  ]);
  run("powershell", [
    "-NoProfile",
    "-Command",
    `if (Test-Path '${latest}') { Remove-Item -Recurse -Force '${latest}' }; Move-Item '${join(tmp, "cmdline-tools")}' '${latest}'; Remove-Item -Recurse -Force '${tmp}'`,
  ]);
}

const licensesDir = join(sdkRoot, "licenses");
mkdirSync(licensesDir, { recursive: true });
writeFileSync(
  join(licensesDir, "android-sdk-license"),
  "\n24333f8a63b6825ea9c5514f83c2829b004d1fee\n"
);
writeFileSync(
  join(licensesDir, "android-sdk-preview-license"),
  "\n84831b9409646a918e30573bab4c9c91346d8abd\n"
);

const env = {
  ...process.env,
  ANDROID_HOME: sdkRoot,
  ANDROID_SDK_ROOT: sdkRoot,
};

const packages = [
  "platform-tools",
  "platforms;android-35",
  "build-tools;35.0.0",
];

console.log("Installing SDK packages…");
run(sdkmanager, ["--sdk_root=" + sdkRoot, ...packages], {
  env,
  input: "y\ny\ny\ny\ny\n",
});

console.log(`ANDROID_SDK_ROOT=${sdkRoot}`);

const androidDir = join(process.cwd(), "android");
if (existsSync(androidDir)) {
  const sdkDirProp = sdkRoot.replace(/\\/g, "/");
  writeFileSync(join(androidDir, "local.properties"), `sdk.dir=${sdkDirProp}\n`);
  console.log("Wrote android/local.properties");
}
