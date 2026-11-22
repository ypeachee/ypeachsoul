import type { Session } from '../state/session';
import { PRODUCT_NAME } from '../product';

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
      <a class="brand-link" href="#intro" aria-label="返回${PRODUCT_NAME}首页">${PRODUCT_NAME}</a>
      <span class="topbar-note">SINGLE-CASE STUDY · V3.1</span>
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
      <p>浏览器无法写入本地存储；刷新后需要重新研究。</p>
    </div>
  `;
}

export function screenShell(content: string, className = ''): string {
  return `<main class="app-shell ${className}">${appHeader()}${content}</main>`;
}
