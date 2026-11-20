import type { Session } from '../state/session';

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function appHeader(): string {
  return `
    <header class="topbar">
      <a class="brand-link" href="#intro" aria-label="返回灵魂使用说明书首页">灵魂使用说明书</a>
      <span class="topbar-note">内在运行手册</span>
    </header>
  `;
}

export function storageBanner(session: Session): string {
  if (session.storageHealth() !== 'session-only') {
    return '';
  }
  return `
    <div class="notice notice-warning" role="status">
      <strong>本次进度仅在当前页面保留</strong>
      <p>浏览器无法写入本地存储；刷新后需要重新测试。</p>
    </div>
  `;
}

export function screenShell(content: string, className = ''): string {
  return `<main class="app-shell ${className}">${appHeader()}${content}</main>`;
}