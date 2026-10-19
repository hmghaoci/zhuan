# 安卓安装包

- 文件：`zhuan-1.0.0-debug.apk`
- 包名：`com.hmghaoci.zhuan`
- 版本：`1.0.0`

## 安装

把 APK 拷到手机后打开安装。如系统提示「未知来源」，允许本文件管理器安装即可。

## 离线使用

安装后关闭网络也能改选项、切换主题、完成六种抽签。选项保存在手机本地。

## 从 GitHub 更新

1. 在 [hmghaoci/zhuan Releases](https://github.com/hmghaoci/zhuan/releases) 新建 Release
2. Tag 写成比当前更高的版本号，例如 `v1.0.1`
3. 上传新的 `.apk` 附件
4. 手机联网后，在 App 右上角点刷新图标「检查更新」，确认后下载并打开系统安装界面

## 本机重新打包

```bash
npm run android:apk
```

需要 JDK 21（不要用 JDK 26 作为 `JAVA_HOME`）和本机 Android SDK。
