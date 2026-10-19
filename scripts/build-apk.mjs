import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const gradlew = join(root, "android", "gradlew.bat");
if (!existsSync(gradlew)) {
  console.error("android/ missing. Run: npx cap add android");
  process.exit(1);
}

const env = { ...process.env };
if (!env.ANDROID_HOME && !env.ANDROID_SDK_ROOT) {
  const localSdk = join(process.env.LOCALAPPDATA || "", "Android", "Sdk");
  if (existsSync(localSdk)) {
    env.ANDROID_HOME = localSdk;
    env.ANDROID_SDK_ROOT = localSdk;
  }
}

const jdk21 = "C:\\Program Files\\Microsoft\\jdk-21.0.12.101-hotspot";
if (existsSync(jdk21)) {
  env.JAVA_HOME = jdk21;
  env.Path = `${jdk21}\\bin;${env.Path || ""}`;
}

const result = spawnSync(gradlew, ["assembleDebug"], {
  cwd: join(root, "android"),
  env,
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}

const apkSrc = join(
  root,
  "android",
  "app",
  "build",
  "outputs",
  "apk",
  "debug",
  "app-debug.apk"
);
const outDir = join(root, "release");
mkdirSync(outDir, { recursive: true });
const apkDest = join(outDir, "zhuan-1.0.0-debug.apk");
copyFileSync(apkSrc, apkDest);
console.log(`APK ready: ${apkDest}`);
