import { trackEvent } from '../../analytics/events';
import { getArchetype } from '../../domain/scoring';
import { buildLensReadings } from '../../knowledge/lenses';
import { PRODUCT_NAME, PRODUCT_VERSION_LABEL } from '../../product';
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
  const navButtons = readings.map((lens) => `
    <button type="button" class="lens-nav-button" data-lens-target="${escapeHtml(lens.id)}">
      ${escapeHtml(lens.title)}
    </button>
  `).join('');
  const lensCards = readings.map((lens, index) => {
    const toolAction = lens.id === 'tarot'
      ? '<a class="lens-enter-button" data-lens-tool="tarot" href="#tarot">开始 78 牌三牌实验 →</a>'
      : lens.id === 'bazi'
        ? '<a class="lens-enter-button" data-lens-tool="bazi" href="#bazi">输入出生信息，开始排盘 →</a>'
        : '<span class="lens-preview-badge">知识页先行 · 交互实验待上线</span>';
    const tarot = lens.tarot
      ? `<div class="tarot-row">${lens.tarot.map((card) => `
          <div class="tarot-card">
            <span class="tarot-orientation">${escapeHtml(card.orientation)}</span>
            <strong>${escapeHtml(card.name)}</strong>
            <p>${escapeHtml(card.meaning)}</p>
          </div>`).join('')}</div>`
      : '';
    return `
      <details class="lens-card" id="lens-${escapeHtml(lens.id)}" data-lens-id="${escapeHtml(lens.id)}">
        <summary class="lens-summary">
          <span class="lens-summary-index">${String(index + 1).padStart(2, '0')}</span>
          <span class="lens-summary-copy">
            <span class="eyebrow">${escapeHtml(lens.kicker)}</span>
            <h2>${escapeHtml(lens.title)}</h2>
            <span class="lens-summary-observation">${escapeHtml(lens.observation)}</span>
          </span>
          <span class="lens-summary-toggle" aria-hidden="true">展开</span>
        </summary>
        <div class="lens-card-body">
          <div class="lens-card-head">
            <p class="lens-method">${escapeHtml(lens.method)}</p>
            <a href="${escapeHtml(lens.sourceUrl)}" target="_blank" rel="noreferrer noopener">来源仓库 ↗</a>
          </div>
          <p class="lens-observation">${escapeHtml(lens.observation)}</p>
          ${tarot}
          <div class="lens-question">
            <span>反思问题</span>
            <p>${escapeHtml(lens.question)}</p>
          </div>
          <p class="lens-practice"><strong>今日练习：</strong>${escapeHtml(lens.practice)}</p>
          ${toolAction}
          <p class="lens-license">${escapeHtml(lens.sourceLabel)} · ${escapeHtml(lens.license)}</p>
        </div>
      </details>
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
        <p class="eyebrow">APPENDIX A · SIX INTERPRETIVE LENSES · ${PRODUCT_VERSION_LABEL}</p>
        <h1 id="lens-title" tabindex="-1">六镜附录</h1>
        <p class="lede">同一份答案，用六种文化语言重新描述一遍。八字与塔罗已开放本地交互实验；所有结果都是文化解释练习，不是预测、诊断或现实决策依据。</p>
        <p class="research-meta-line">研究结论：${escapeHtml(primary.name)} × ${escapeHtml(secondary.name)} · 主研究样本：n=1</p>
      </header>

      <div class="lens-boundary">
        <strong>阅读方式</strong>
        <p>每一镜都只提供一个观察角度。八字与塔罗可以继续操作，其余四镜先保留为知识与反思页。</p>
      </div>

      <nav class="lens-nav" aria-label="六镜快捷导航">
        <span class="lens-nav-label">六镜导航</span>
        <div class="lens-nav-list">${navButtons}</div>
      </nav>
      <div class="lens-list-controls">
        <button type="button" class="text-button" data-lens-action="expand">展开全部</button>
        <button type="button" class="text-button" data-lens-action="collapse">收起全部</button>
      </div>

      <div class="lens-grid">${lensCards}</div>

      <section class="source-ledger" aria-labelledby="source-title">
        <p class="eyebrow">METHOD SOURCES</p>
        <h2 id="source-title">工具台账</h2>
        <p>八字排盘由 MIT 许可的 lunar-typescript 在浏览器内完成；塔罗采用 MIT 仓库的牌组结构与本地抽牌方法；风水只参考 MIT 仓库的环境观察方法。其余未声明许可证的来源只作高层方法论参考。</p>
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

  const details = Array.from(root.querySelectorAll<HTMLDetailsElement>('details[data-lens-id]'));
  const updateToggleLabels = (): void => {
    for (const detail of details) {
      const toggle = detail.querySelector<HTMLElement>('.lens-summary-toggle');
      if (toggle) {
        toggle.textContent = detail.open ? '收起' : '展开';
      }
    }
  };
  const setAll = (open: boolean): void => {
    for (const detail of details) {
      detail.open = open;
    }
    updateToggleLabels();
  };
  const openLens = (id: string): void => {
    setAll(false);
    const target = root.querySelector<HTMLDetailsElement>(`#lens-${CSS.escape(id)}`);
    if (!target) {
      return;
    }
    target.open = true;
    updateToggleLabels();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    target.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
  };

  root.querySelectorAll<HTMLButtonElement>('[data-lens-target]').forEach((button) => {
    button.addEventListener('click', () => openLens(button.dataset.lensTarget ?? ''));
  });
  root.querySelector<HTMLButtonElement>('[data-lens-action="expand"]')?.addEventListener('click', () => setAll(true));
  root.querySelector<HTMLButtonElement>('[data-lens-action="collapse"]')?.addEventListener('click', () => setAll(false));
  details.forEach((detail) => detail.addEventListener('toggle', updateToggleLabels));
  root.querySelector<HTMLButtonElement>('#lens-close')?.addEventListener('click', actions.close);
  root.querySelector<HTMLButtonElement>('#lens-share')?.addEventListener('click', actions.share);
  window.requestAnimationFrame(() => focusHeading());
}
