import { Capacitor } from '@capacitor/core';

export const APP_VERSION = '1.0.0';
export const GITHUB_OWNER = 'hmghaoci';
export const GITHUB_REPO = 'zhuan';

export type UpdateCheckResult =
  | { status: 'latest'; current: string; latest: string }
  | { status: 'available'; current: string; latest: string; apkUrl: string; releaseName: string }
  | { status: 'none'; current: string; message: string }
  | { status: 'error'; current: string; message: string };

function normalizeVersion(raw: string): string {
  return String(raw || '')
    .trim()
    .replace(/^v/i, '');
}

/** Compare dotted versions. Returns 1 if a > b, -1 if a < b, 0 if equal. */
export function compareVersions(a: string, b: string): number {
  const pa = normalizeVersion(a)
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const pb = normalizeVersion(b)
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

export function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export async function getInstalledVersion(): Promise<string> {
  if (!isNativeAndroid()) return APP_VERSION;
  try {
    const { App } = await import('@capacitor/app');
    const info = await App.getInfo();
    return info.version || APP_VERSION;
  } catch {
    return APP_VERSION;
  }
}

export async function checkForUpdate(): Promise<UpdateCheckResult> {
  const current = await getInstalledVersion();
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'zhuan-decision-os',
        },
      }
    );

    if (res.status === 404) {
      return { status: 'none', current, message: 'GitHub 上还没有 Release，暂无更新' };
    }
    if (!res.ok) {
      return {
        status: 'error',
        current,
        message: `检查更新失败（HTTP ${res.status}）`,
      };
    }

    const data = (await res.json()) as {
      tag_name?: string;
      name?: string;
      assets?: Array<{ name?: string; browser_download_url?: string }>;
    };

    const latest = normalizeVersion(data.tag_name || '');
    if (!latest) {
      return { status: 'none', current, message: '最新 Release 没有可用版本号' };
    }

    const apk = (data.assets || []).find((a) =>
      String(a.name || '')
        .toLowerCase()
        .endsWith('.apk')
    );
    if (!apk?.browser_download_url) {
      return {
        status: 'none',
        current,
        message: '最新 Release 里没有 APK 附件',
      };
    }

    if (compareVersions(latest, current) <= 0) {
      return { status: 'latest', current, latest };
    }

    return {
      status: 'available',
      current,
      latest,
      apkUrl: apk.browser_download_url,
      releaseName: data.name || data.tag_name || latest,
    };
  } catch {
    return {
      status: 'error',
      current,
      message: '无法连接 GitHub，请检查网络后重试',
    };
  }
}

export async function downloadAndInstallApk(apkUrl: string): Promise<void> {
  if (!isNativeAndroid()) {
    throw new Error('仅安卓安装包支持从 GitHub 下载更新');
  }

  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  const { FileOpener } = await import('@capacitor-community/file-opener');

  const fileName = `zhuan-update-${Date.now()}.apk`;
  const downloaded = await Filesystem.downloadFile({
    url: apkUrl,
    path: fileName,
    directory: Directory.Cache,
  });

  const path = downloaded.path;
  if (!path) {
    throw new Error('下载完成但找不到本地文件');
  }

  await FileOpener.open({
    filePath: path,
    contentType: 'application/vnd.android.package-archive',
    openWithDefault: true,
  });
}
