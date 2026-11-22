import { getAttribution } from '../../analytics/attribution';
import { trackEvent } from '../../analytics/events';
import { getArchetype } from '../../domain/scoring';
import type { Session } from '../../state/session';
import { renderShareCard } from '../../share/card';
import { copyText, downloadCanvas } from '../../share/download';
import { createShareQrDataUrl } from '../../share/qr';
import { buildShareText } from '../../share/text';
import { buildShareUrl } from '../../share/url';
import { PRODUCT_NAME } from '../../product';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface ShareActions {
  close(): void;
}

export function renderShare(root: HTMLElement, session: Session, actions: ShareActions): void {
  const result = session.state().result;
  if (!result) {
    actions.close();
    return;
  }
  const archetype = getArchetype(result.archetypeId);
  const secondary = getArchetype(result.secondaryArchetypeId);
  let storage: Storage | undefined;
  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }
  const attribution = getAttribution(storage);
  const shareText = buildShareText(result, buildShareUrl(result.archetypeId, undefined, attribution, 'text'));

  const content = `
    ${storageBanner(session)}
    <section class="share-card-layout" aria-labelledby="share-title">
      <header class="share-copy">
        <p class="eyebrow">READY TO SHARE · SIX-LENS V3.0</p>
        <h1 id="share-title" tabindex="-1">分享卡</h1>
        <p class="lede">保存为竖版图片，或复制文字发给你想分享的人。</p>
      </header>
      <div class="share-stage">
        <canvas id="share-canvas" width="1080" height="1440" aria-label="${escapeHtml(archetype.name)} × ${escapeHtml(secondary.name)}的分享卡预览"></canvas>
        <div id="share-error" hidden></div>
      </div>
      <div class="share-actions">
        <button class="primary-button" id="download-card" type="button" disabled>下载 PNG</button>
        <button class="secondary-button" id="copy-share-text" type="button">复制结果文案</button>
        <button class="text-button" id="close-share" type="button">关闭预览</button>
      </div>
      <p class="share-status" id="share-status" role="status" aria-live="polite">正在生成分享卡…</p>
      <p class="global-disclaimer">娱乐性自我报告，不构成心理/医疗诊断</p>
    </section>
  `;

  root.innerHTML = screenShell(content, 'share-shell');
  document.title = `${archetype.name} × ${secondary.name} · ${PRODUCT_NAME}`;
  const canvas = root.querySelector<HTMLCanvasElement>('#share-canvas');
  const stage = root.querySelector<HTMLElement>('.share-stage');
  const status = root.querySelector<HTMLElement>('#share-status');
  const downloadButton = root.querySelector<HTMLButtonElement>('#download-card');
  const copyButton = root.querySelector<HTMLButtonElement>('#copy-share-text');
  let busy = false;
  let cardReady = false;

  const showCardError = (): void => {
    if (stage) {
      stage.innerHTML = `
        <div class="notice notice-error share-error-panel" role="alert">
          <p class="eyebrow">CARD RENDER ERROR</p>
          <h2>分享卡生成失败</h2>
          <p>你的结果仍然保留。可以重新生成，或直接复制文字版。</p>
          <div class="action-row">
            <button class="secondary-button" id="retry-card" type="button">重新生成</button>
            <button class="primary-button" id="copy-fallback" type="button">复制文字版</button>
            <button class="text-button" id="back-result" type="button">返回结果</button>
          </div>
        </div>
      `;
    }
    if (downloadButton) {
      downloadButton.disabled = true;
    }
    root.querySelector<HTMLButtonElement>('#retry-card')?.addEventListener('click', () => {
      renderShare(root, session, actions);
    });
    root.querySelector<HTMLButtonElement>('#copy-fallback')?.addEventListener('click', handleCopy);
    root.querySelector<HTMLButtonElement>('#back-result')?.addEventListener('click', actions.close);
    announce('分享卡生成失败');
  };

  const handleCopy = async (): Promise<void> => {
    if (busy) {
      return;
    }
    busy = true;
    const copyTarget = root.querySelector<HTMLButtonElement>('#copy-share-text') ?? root.querySelector<HTMLButtonElement>('#copy-fallback');
    if (copyTarget) {
      copyTarget.disabled = true;
    }
    const outcome = await copyText(shareText);
    if (status) {
      status.textContent = outcome === 'copied' ? '结果文案已复制' : '当前浏览器不支持自动复制，请手动选择文字';
    }
    if (outcome === 'copied') {
      trackEvent('share_text_copy', { archetypeId: archetype.id });
      announce('结果文案已复制');
    }
    if (copyTarget) {
      copyTarget.disabled = false;
    }
    busy = false;
  };

  const initializeCard = async (): Promise<void> => {
    if (!canvas) {
      showCardError();
      return;
    }
    try {
      const qrDataUrl = await createShareQrDataUrl(archetype.id, undefined, attribution);
      await renderShareCard(canvas, archetype, secondary, qrDataUrl);
      cardReady = true;
      if (downloadButton) {
        downloadButton.disabled = false;
      }
      if (status) {
        status.textContent = '分享卡已准备好';
      }
      trackEvent('share_card_open', { archetypeId: archetype.id });
      announce('分享卡已准备好');
    } catch {
      cardReady = false;
      if (status) {
        status.textContent = '分享卡生成失败';
      }
      showCardError();
    }
  };

  downloadButton?.addEventListener('click', async () => {
    if (!canvas || busy || !cardReady) {
      return;
    }
    busy = true;
    downloadButton.disabled = true;
    const outcome = await downloadCanvas(canvas, `${PRODUCT_NAME}-${archetype.name}-${secondary.name}.png`);
    if (outcome === 'downloaded') {
      trackEvent('share_card_download', { archetypeId: archetype.id });
    }
    if (status) {
      status.textContent = outcome === 'downloaded' ? '分享卡已开始下载' : '当前浏览器不支持自动下载，请长按图片保存';
    }
    downloadButton.disabled = false;
    busy = false;
  });

  copyButton?.addEventListener('click', handleCopy);
  root.querySelector<HTMLButtonElement>('#close-share')?.addEventListener('click', actions.close);
  window.requestAnimationFrame(() => focusHeading());
  void initializeCard();
}
