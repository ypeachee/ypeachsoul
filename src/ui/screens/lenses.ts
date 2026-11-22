import { trackEvent } from '../../analytics/events';
import { getArchetype } from '../../domain/scoring';
import { buildLensReadings } from '../../knowledge/lenses';
import { PRODUCT_NAME } from '../../product';
import type { Session } from '../../state/session';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface LensActions {
  close(): void;
  share(): void;
}

export function renderLenses(root: HTMLElement, session: Session, actions: LensActions): void {
  const result = session.state().result;
  if (!result) {
    actions.close();
    return;
  }

  const primary = getArchetype(result.archetypeId);
  const secondary = getArchetype(result.secondaryArchetypeId);
  const readings = buildLensReadings(result);
  const lensCards = readings.map((lens) => {
    const tarot = lens.tarot
      ? `<div class="tarot-row">${lens.tarot.map((card) => `
          <div class="tarot-card">
            <span class="tarot-orientation">${escapeHtml(card.orientation)}</span>
            <strong>${escapeHtml(card.name)}</strong>
            <p>${escapeHtml(card.meaning)}</p>
          </div>`).join('')}</div>`
      : '';
    return `
      <article class="lens-card" data-lens-id="${escapeHtml(lens.id)}">
        <header class="lens-card-head">
          <div>
            <p class="eyebrow">${escapeHtml(lens.kicker)}</p>
            <h2>${escapeHtml(lens.title)}</h2>
          </div>
          <a href="${escapeHtml(lens.sourceUrl)}" target="_blank" rel="noreferrer noopener">来源仓库 ↗</a>
        </header>
        <p class="lens-method">${escapeHtml(lens.method)}</p>
        <p class="lens-observation">${escapeHtml(lens.observation)}</p>
        ${tarot}
        <div class="lens-question">
          <span>反思问题</span>
          <p>${escapeHtml(lens.question)}</p>
        </div>
        <p class="lens-practice"><strong>今日练习：</strong>${escapeHtml(lens.practice)}</p>
        <p class="lens-license">${escapeHtml(lens.sourceLabel)} · ${escapeHtml(lens.license)}</p>
      </article>
    `;
  }).join('');

  const sourceRows = readings.map((lens) => `
    <li>
      <a href="${escapeHtml(lens.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(lens.sourceLabel)}</a>
      <span>${escapeHtml(lens.license)}</span>
    </li>
  `).join('');

  const content = `
    ${storageBanner(session)}
    <section class="lens-shell-card" aria-labelledby="lens-title">
      <header class="lens-hero">
        <p class="eyebrow">APPENDIX A · SIX INTERPRETIVE LENSES · V3.0</p>
        <h1 id="lens-title" tabindex="-1">六镜附录</h1>
        <p class="lede">同一份答案，用六种文化语言重新描述一遍。这里是解释练习，不是排盘、预测、诊断或投资建议。</p>
        <p class="research-meta-line">研究结论：${escapeHtml(primary.name)} × ${escapeHtml(secondary.name)} · 主研究样本：n=1</p>
      </header>

      <div class="lens-boundary">
        <strong>阅读方式</strong>
        <p>每一镜都只提供一个观察角度。把它们当成“换一种说法看自己”，不要当成关于未来的事实。</p>
      </div>

      <div class="lens-grid">${lensCards}</div>

      <section class="source-ledger" aria-labelledby="source-title">
        <p class="eyebrow">METHOD SOURCES</p>
        <h2 id="source-title">工具台账</h2>
        <p>本页只借鉴各仓库的高层方法与工程思想，不复制未授权内容。八字与塔罗来源为 MIT；其余来源未声明明确许可证。</p>
        <ul>${sourceRows}</ul>
      </section>

      <div class="lens-actions">
        <button class="primary-button" id="lens-share" type="button">生成分享卡</button>
        <button class="secondary-button" id="lens-close" type="button">返回研究结论</button>
      </div>
      <p class="global-disclaimer">娱乐性自我观察，不构成心理/医疗诊断、命理预测或现实决策依据</p>
    </section>
  `;

  root.innerHTML = screenShell(content, 'lens-shell');
  document.title = `六镜附录 · ${PRODUCT_NAME}`;
  trackEvent('lens_view', { archetypeId: primary.id });
  announce(`六镜附录已打开，研究结论是${primary.name}，竞争解释是${secondary.name}`);
  root.querySelector<HTMLButtonElement>('#lens-close')?.addEventListener('click', actions.close);
  root.querySelector<HTMLButtonElement>('#lens-share')?.addEventListener('click', actions.share);
  window.requestAnimationFrame(() => focusHeading());
}
