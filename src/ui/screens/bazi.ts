import { trackEvent } from '../../analytics/events';
import { buildBaziProfile, elementPractice, type BaziGender, type WuXing } from '../../domain/bazi';
import { getArchetype } from '../../domain/scoring';
import { PRODUCT_NAME, PRODUCT_VERSION_LABEL } from '../../product';
import type { Session } from '../../state/session';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface BaziActions {
  back(): void;
  lenses(): void;
}

const ELEMENT_ORDER: readonly WuXing[] = ['木', '火', '土', '金', '水'];

export function renderBazi(root: HTMLElement, session: Session, actions: BaziActions): void {
  const result = session.state().result;
  if (!result) {
    actions.back();
    return;
  }

  const primary = getArchetype(result.archetypeId);
  const content = `
    ${storageBanner(session)}
    <section class="tool-shell-card" aria-labelledby="bazi-title">
      <header class="tool-hero">
        <button class="text-button tool-back" id="bazi-back" type="button">← 返回六镜</button>
        <p class="eyebrow">INTERACTIVE LENS · BAZI · ${PRODUCT_VERSION_LABEL}</p>
        <h1 id="bazi-title" tabindex="-1">出生节律排盘</h1>
        <p class="lede">输入出生日期与时间，在浏览器内排出四柱与表层五行。它不是命运判决，而是一张关于节律与偏好的文化观察卡。</p>
        <div class="research-meta" aria-label="八字实验说明">
          <span><strong>计算</strong> 浏览器本地</span>
          <span><strong>历法</strong> 北京时间</span>
          <span><strong>研究结论</strong> ${escapeHtml(primary.name)} · n=1</span>
        </div>
        <div class="tool-boundary">
          <strong>隐私与边界</strong>
          <p>出生信息只在当前页面计算，不写入 localStorage、不上传服务器。未校正出生地真太阳时；结果仅供文化娱乐与自我反思，不替代医疗、法律、财务或重大人生决策。</p>
        </div>
      </header>

      <form class="lens-form" id="bazi-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="bazi-date">出生日期</label>
            <input id="bazi-date" name="birthDate" type="date" min="1900-01-01" max="2100-12-31" required />
          </div>
          <div class="form-field">
            <label for="bazi-time">出生时间</label>
            <input id="bazi-time" name="birthTime" type="time" />
            <label class="checkbox-field" for="bazi-time-unknown">
              <input id="bazi-time-unknown" name="timeKnown" type="checkbox" />
              <span>出生时间不确定</span>
            </label>
          </div>
          <div class="form-field">
            <label for="bazi-gender">性别</label>
            <select id="bazi-gender" name="gender">
              <option value="unspecified">不透露</option>
              <option value="female">女</option>
              <option value="male">男</option>
            </select>
            <span class="field-hint">仅用于大运顺逆排；选择“不透露”时不会展示大运。</span>
          </div>
        </div>
        <div id="bazi-error" role="alert" hidden></div>
        <div class="tool-form-actions">
          <button class="primary-button" type="submit">排出我的四柱</button>
          <button class="text-button" id="bazi-lenses" type="button">返回六镜附录</button>
        </div>
      </form>

      <section class="tool-reading" id="bazi-reading" aria-live="polite" hidden></section>

      <p class="global-disclaimer">娱乐性文化体验，不构成命理预测或现实决策依据</p>
    </section>
  `;

  root.innerHTML = screenShell(content, 'tool-shell');
  document.title = `出生节律排盘 · ${PRODUCT_NAME}`;
  trackEvent('lens_view', { archetypeId: primary.id });
  announce('出生节律排盘已打开');

  const form = root.querySelector<HTMLFormElement>('#bazi-form');
  const readingRoot = root.querySelector<HTMLElement>('#bazi-reading');
  const errorRoot = root.querySelector<HTMLElement>('#bazi-error');
  const timeInput = root.querySelector<HTMLInputElement>('#bazi-time');
  const timeUnknown = root.querySelector<HTMLInputElement>('#bazi-time-unknown');

  const syncTimeState = (): void => {
    if (!timeInput || !timeUnknown) return;
    timeInput.disabled = timeUnknown.checked;
    if (timeUnknown.checked) timeInput.value = '';
  };
  timeUnknown?.addEventListener('change', syncTimeState);
  syncTimeState();

  const showError = (message: string): void => {
    if (!errorRoot) return;
    errorRoot.className = 'notice notice-error';
    errorRoot.innerHTML = `<strong>无法排盘</strong><p>${escapeHtml(message)}</p>`;
    errorRoot.hidden = false;
    announce(message);
  };

  const renderProfile = (birthDate: string, birthTime: string, timeKnown: boolean, gender: BaziGender): void => {
    const outcome = buildBaziProfile({ birthDate, birthTime, timeKnown, gender });
    if (!outcome.ok) {
      showError(outcome.error);
      return;
    }
    if (errorRoot) errorRoot.hidden = true;
    if (!readingRoot) return;

    const profile = outcome.profile;
    const maxElement = Math.max(...ELEMENT_ORDER.map((element) => profile.elementCounts[element]), 1);
    const elementRows = ELEMENT_ORDER.map((element) => `
      <div class="element-row">
        <span>${element}</span>
        <div class="element-track" aria-hidden="true"><i style="width:${(profile.elementCounts[element] / maxElement) * 100}%"></i></div>
        <strong>${profile.elementCounts[element]}</strong>
      </div>
    `).join('');
    const pillarCards = profile.pillars.map((pillar) => `
      <article class="pillar-card" data-bazi-pillar="${escapeHtml(pillar.label)}">
        <span>${escapeHtml(pillar.label)}</span>
        <strong>${escapeHtml(pillar.ganZhi)}</strong>
        <p>${escapeHtml(pillar.wuXing)} · ${escapeHtml(pillar.shiShen)}</p>
        <small>${escapeHtml(pillar.naYin)}</small>
      </article>
    `).join('');
    const daYun = profile.currentDaYun
      ? `<p>当前大运：<strong>${escapeHtml(profile.currentDaYun.ganZhi)}</strong>（${profile.currentDaYun.startYear}–${profile.currentDaYun.endYear}）</p>`
      : '<p>未提供性别，因此不展示大运顺逆排。</p>';
    const dominant = profile.dominantElements.join('、');
    const missing = profile.missingElements.length ? profile.missingElements.join('、') : '无';
    const practice = elementPractice(profile.dominantElements[0]);

    readingRoot.innerHTML = `
      <div class="reading-head">
        <div>
          <p class="eyebrow">LOCAL CALCULATION · ${escapeHtml(profile.solarDate)}</p>
          <h2 tabindex="-1">四柱节律卡</h2>
          <p class="reading-question">农历：${escapeHtml(profile.lunarDate)} · 生肖：${escapeHtml(profile.zodiac)}</p>
        </div>
        <button class="secondary-button" id="bazi-edit" type="button">修改出生信息</button>
      </div>

      <div class="pillar-grid">${pillarCards}</div>

      <div class="bazi-summary-grid">
        <section class="reading-panel">
          <p class="eyebrow">DAY MASTER</p>
          <h3>${escapeHtml(profile.dayMaster)}</h3>
          <p>日主是这个模型里的观察中心。它描述一种表达节律，不是对能力、性格或命运的判断。</p>
        </section>
        <section class="reading-panel">
          <p class="eyebrow">ELEMENT SURFACE</p>
          <div class="element-list">${elementRows}</div>
          <p class="element-note">表层偏显：${escapeHtml(dominant)} · 未出现：${escapeHtml(missing)}。统计不含藏干。</p>
        </section>
      </div>

      <div class="reading-panel">
        <p class="eyebrow">CROSS-READING</p>
        <p>你的自我研究报告主原型是「${escapeHtml(primary.name)}」，八字层最显性的元素是「${escapeHtml(dominant)}」。把它当作一个隐喻：当你只使用这套熟悉的能量时，可能也会忽略其他调节方式。</p>
        <p>${daYun}</p>
      </div>

      <div class="reading-action">
        <span>今天可以尝试</span>
        <p>${escapeHtml(practice)}</p>
      </div>

      <details class="method-note">
        <summary>排盘口径与限制</summary>
        <p>四柱由 MIT 许可的 lunar-typescript 按输入时间计算。未校正出生地真太阳时；出生时间不确定时只展示年、月、日三柱。结果不包含健康、投资、法律判断。</p>
      </details>
    `;
    readingRoot.hidden = false;
    root.querySelector<HTMLButtonElement>('#bazi-edit')?.addEventListener('click', () => {
      form?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      root.querySelector<HTMLInputElement>('#bazi-date')?.focus();
    });
    window.requestAnimationFrame(() => readingRoot.querySelector<HTMLElement>('h2')?.focus());
    announce('四柱节律卡已生成');
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const birthDate = String(data.get('birthDate') ?? '');
    const birthTime = String(data.get('birthTime') ?? '');
    const timeKnown = !timeUnknown?.checked;
    const gender = String(data.get('gender') ?? 'unspecified') as BaziGender;
    renderProfile(birthDate, birthTime, timeKnown, gender);
  });

  root.querySelector<HTMLButtonElement>('#bazi-back')?.addEventListener('click', actions.back);
  root.querySelector<HTMLButtonElement>('#bazi-lenses')?.addEventListener('click', actions.lenses);
  window.requestAnimationFrame(() => focusHeading());
}
