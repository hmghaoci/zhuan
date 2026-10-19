# 纠结终结者

离线可用的决策抽签工具。界面包含幸运大转盘、摇签、骰子、硬币、翻牌和指尖抓阄，选项、主题和音效都保存在本机。

只有「检查更新」会联网，从本仓库的 [GitHub Releases](https://github.com/hmghaoci/zhuan/releases) 获取更新的 APK。

## 浏览器预览

直接用浏览器打开 [`wheel.html`](./wheel.html)。不需要安装依赖，抽签功能可离线使用。

## 安装安卓包

当前版本 **1.0.0**：

- 仓库文件：[`release/zhuan-1.0.0-debug.apk`](./release/zhuan-1.0.0-debug.apk)
- 安装包也会附在对应版本的 GitHub Release 上

把 APK 拷到手机后打开安装。如果系统拦截，允许该来源安装应用。安装后关闭网络，仍可以改选项并完成抽签。

右上角刷新图标是「检查更新」。发现更高版本号的 Release，并且附件是 `.apk` 时，确认后会下载并打开系统安装界面。

## 发布新版本

1. 把 `package.json` 的 `version`、`src/update.ts` 里的 `APP_VERSION`、`android/app/build.gradle` 的 `versionName` 改成同一个更高版本，例如 `1.0.1`。`versionCode` 要比上一版大。
2. 在项目目录执行：

```bash
npm install
npm run android:apk
```

3. 在 GitHub 新建 Release。Tag 写成 `v1.0.1` 这种形式，并上传新的 `.apk`。
4. 手机联网后点「检查更新」，确认安装。

打包需要 JDK 21。不要把 `JAVA_HOME` 指到 JDK 26。Android SDK 默认使用 `%LOCALAPPDATA%\Android\Sdk`。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。`npm run build` 会重新生成 `wheel.html`。
