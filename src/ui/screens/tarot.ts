import { trackEvent } from '../../analytics/events';
import { getArchetype } from '../../domain/scoring';
import { createTarotReading } from '../../knowledge/tarot';
import { PRODUCT_NAME, PRODUCT_VERSION_LABEL } from '../../product';
import type { Session } from '../../state/session';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface TarotActions {
  back(): void;
  lenses(): void;
}

export function renderTarot(root: HTMLElement, session: Session, actions: TarotActions): void {
  const result = session.state().result;
  if (!result) {
    actions.back();
    return;
  }

  const primary = getArchetype(result.archetypeId);
  const content = `
    ${storageBanner(session)}
    <section class="tool-shell-card" aria-labelledby="tarot-title">
      <header class="tool-hero">
        <button class="text-button tool-back" id="tarot-back" type="button">← 返回六镜</button>
        <p class="eyebrow">INTERACTIVE LENS · TAROT · ${PRODUCT_VERSION_LABEL}</p>
        <h1 id="tarot-title" tabindex="-1">塔罗三牌实验</h1>
        <p class="lede">把问题交给一组三牌叙事：当下、张力、下一步。抽牌在浏览器本地完成，不调用预测服务。</p>
        <div class="research-meta" aria-label="塔罗实验说明">
          <span><strong>牌组</strong> 完整 78 张</span>
          <span><strong>牌阵</strong> 三牌叙事</span>
          <span><strong>研究结论</strong> ${escapeHtml(primary.name)} · n=1</span>
        </div>
        <div class="tool-boundary">
          <strong>边界</strong>
          <p>塔罗是镜子，不是水晶球。结果只用于自我观察，不替代医疗、法律、投资或重大人生决策；不声称预测未来。</p>
        </div>
      </header>

      <form class="lens-form" id="tarot-form">
        <div class="form-field">
          <label for="tarot-question">你此刻想问什么？ <span>可选，最多 120 字</span></label>
          <textarea id="tarot-question" name="question" rows="3" maxlength="120" placeholder="例如：我现在最该先处理哪件拖了很久的事？"></textarea>
        </div>
        <div class="tool-form-actions">
          <button class="primary-button" type="submit">洗牌并抽取三张</button>
          <button class="text-button" id="tarot-lenses" type="button">返回六镜附录</button>
        </div>
      </form>

      <section class="tool-reading" id="tarot-reading" aria-live="polite" hidden></section>

      <p class="global-disclaimer">娱乐性文化体验，不构成命理预测或现实决策依据</p>
    </section>
  `;

  root.innerHTML = screenShell(content, 'tool-shell');
  document.title = `塔罗三牌实验 · ${PRODUCT_NAME}`;
  trackEvent('lens_view', { archetypeId: primary.id });
  announce('塔罗三牌实验已打开');

  const form = root.querySelector<HTMLFormElement>('#tarot-form');
  const readingRoot = root.querySelector<HTMLElement>('#tarot-reading');
  const questionInput = root.querySelector<HTMLTextAreaElement>('#tarot-question');

  const renderReading = (question: string): void => {
    if (!readingRoot) return;
    const reading = createTarotReading(question);
    const cards = reading.cards.map((card) => `
      <article class="drawn-card" data-tarot-card data-orientation="${escapeHtml(card.orientation)}">
        <span class="drawn-card-position">${escapeHtml(card.position)}</span>
        <span class="drawn-card-orientation">${escapeHtml(card.orientation)} · ${escapeHtml(card.element)}</span>
        <h3>${escapeHtml(card.name)}</h3>
        <p>${escapeHtml(card.meaning)}</p>
        <span class="drawn-card-meta">${escapeHtml(card.arcana)} · ${escapeHtml(card.suit === 'major' ? '大牌' : '小牌')}</span>
      </article>
    `).join('');

    readingRoot.innerHTML = `
      <div class="reading-head">
        <div>
          <p class="eyebrow">LOCAL DRAW · SEED ${String(reading.seed).padStart(8, '0').slice(-8)}</p>
          <h2 tabindex="-1">三牌叙事</h2>
          <p class="reading-question">${reading.question ? `问题：${escapeHtml(reading.question)}` : '问题：对此刻保持开放'}</p>
        </div>
        <button class="secondary-button" id="tarot-redraw" type="button">重新抽牌</button>
      </div>
      <div class="drawn-card-grid">${cards}</div>
      <div class="reading-panel">
        <p class="eyebrow">OVERVIEW</p>
        <p>${escapeHtml(reading.overview)}</p>
        <p>${escapeHtml(reading.story)}</p>
      </div>
      <div class="reading-action">
        <span>今天只做一件小事</span>
        <p>${escapeHtml(reading.action)}</p>
      </div>
      <p class="reading-closing">${escapeHtml(reading.closing)}</p>
    `;
    readingRoot.hidden = false;
    root.querySelector<HTMLButtonElement>('#tarot-redraw')?.addEventListener('click', () => {
      renderReading(questionInput?.value ?? '');
      announce('已重新抽取三张牌');
    });
    window.requestAnimationFrame(() => {
      readingRoot.querySelector<HTMLElement>('h2')?.focus();
    });
    announce('三张牌已经抽取完成');
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderReading(questionInput?.value ?? '');
  });
  root.querySelector<HTMLButtonElement>('#tarot-back')?.addEventListener('click', actions.back);
  root.querySelector<HTMLButtonElement>('#tarot-lenses')?.addEventListener('click', actions.lenses);
  window.requestAnimationFrame(() => focusHeading());
}
