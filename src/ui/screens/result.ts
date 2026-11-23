import { trackEvent } from '../../analytics/events';
import { getArchetype } from '../../domain/scoring';
import { ARCHETYPE_IDS, type ArchetypeId } from '../../domain/types';
import { METHOD_FRAMEWORK, PRODUCT_NAME, PRODUCT_VERSION_LABEL } from '../../product';
import type { Session } from '../../state/session';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface ResultActions {
  share(): void;
  lenses(): void;
  restart(): void;
  home(): void;
}

export function renderResult(root: HTMLElement, session: Session, actions: ResultActions): void {
  const result = session.state().result;
  if (!result) {
    actions.home();
    return;
  }

  const archetype = getArchetype(result.archetypeId);
  const secondary = getArchetype(result.secondaryArchetypeId);
  const advantages = archetype.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const blindSpots = archetype.blindSpots.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const ranked = ARCHETYPE_IDS
    .map((id) => ({ id, score: result.scores[id] }))
    .sort((a, b) => {
      if (a.id === archetype.id) return -1;
      if (b.id === archetype.id) return 1;
      if (a.id === secondary.id) return -1;
      if (b.id === secondary.id) return 1;
      return b.score - a.score || ARCHETYPE_IDS.indexOf(a.id) - ARCHETYPE_IDS.indexOf(b.id);
    })
    .slice(0, 4);
  const topScore = Math.max(...ranked.map((item) => item.score), 1);
  const evidenceRows = ranked.map((item) => {
    const itemArchetype = getArchetype(item.id);
    const width = Math.max(8, Math.round((item.score / topScore) * 100));
    return `
      <div class="evidence-row ${item.id === archetype.id ? 'is-primary' : ''}">
        <div class="evidence-label">
          <span>${escapeHtml(itemArchetype.name)}</span>
          <strong>${item.score}</strong>
        </div>
        <div class="evidence-track" aria-hidden="true">
          <i style="width:${width}%;background:${escapeHtml(itemArchetype.accent)}"></i>
        </div>
      </div>
    `;
  }).join('');

  const content = `
    ${storageBanner(session)}
    <article class="result-card research-report" style="--archetype-accent:${escapeHtml(archetype.accent)}">
      <header class="result-hero research-hero">
        <p class="eyebrow">RESEARCH NOTE · N=1 · 30 ITEMS · ${PRODUCT_VERSION_LABEL}</p>
        <h1 tabindex="-1">研究结论</h1>
        <p class="research-meta-line">方法框架：${METHOD_FRAMEWORK} · 研究类型：娱乐性自我报告</p>
        <p class="result-name">${escapeHtml(archetype.name)}</p>
        <p class="result-tagline">${escapeHtml(archetype.tagline)}</p>
        <p class="research-secondary">竞争解释：<strong>${escapeHtml(secondary.name)}</strong></p>
        <ul class="keyword-list" aria-label="运行参数">
          ${archetype.keywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join('')}
        </ul>
      </header>

      <section class="evidence-panel" aria-labelledby="evidence-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">EVIDENCE PROFILE</p>
            <h2 id="evidence-title">证据分布</h2>
          </div>
          <span class="sample-badge">n=1</span>
        </div>
        <div class="evidence-list">${evidenceRows}</div>
      </section>

      <div class="result-grid">
        <section class="result-section">
          <h2>主要证据</h2>
          <ul>${advantages}</ul>
        </section>
        <section class="result-section">
          <h2>反例与盲点</h2>
          <ul>${blindSpots}</ul>
        </section>
        <section class="result-section result-section-wide">
          <h2>关系场景</h2>
          <p>${escapeHtml(archetype.relationship)}</p>
        </section>
        <section class="result-section result-section-wide">
          <h2>工作场景</h2>
          <p>${escapeHtml(archetype.work)}</p>
        </section>
        <section class="result-section result-action-card result-section-wide">
          <h2>下一步观察</h2>
          <p>${escapeHtml(archetype.action)}</p>
        </section>
        <section class="research-limits result-section-wide">
          <h2>研究局限</h2>
          <p>这是一份关于当前选择偏好的娱乐性自我报告，不是固定人格、临床诊断、能力判断或对他人的预测。样本量为 1，且只代表你此刻的回答。</p>
        </section>
      </div>

      <div class="result-actions">
        <button class="primary-button" id="share-result" type="button">生成分享卡</button>
        <button class="secondary-button" id="lenses-result" type="button">打开六镜附录</button>
        <button class="secondary-button" id="restart-result" type="button">重新研究</button>
        <button class="text-button" id="home-result" type="button">返回首页</button>
      </div>
    </article>

    <dialog class="confirm-dialog" id="reset-dialog" aria-labelledby="reset-title">
      <div class="dialog-body">
        <p class="eyebrow">RESET THE STUDY</p>
        <h2 id="reset-title">清除当前研究？</h2>
        <p>这会删除本次答案和结果。操作完成后会从第一题重新开始。</p>
        <div class="dialog-actions">
          <button class="secondary-button" value="cancel" formmethod="dialog">取消</button>
          <button class="danger-button" id="confirm-reset" type="button">确认重新研究</button>
        </div>
      </div>
    </dialog>

    <p class="global-disclaimer">娱乐性自我报告，不构成心理/医疗诊断、命理预测或现实决策依据</p>
  `;

  root.innerHTML = screenShell(content, 'result-shell');
  document.title = `${archetype.name} × ${secondary.name} · ${PRODUCT_NAME}`;
  trackEvent('result_view', { archetypeId: archetype.id });
  announce(`研究结论是${archetype.name}，竞争解释是${secondary.name}`);

  const dialog = root.querySelector<HTMLDialogElement>('#reset-dialog');
  root.querySelector<HTMLButtonElement>('#share-result')?.addEventListener('click', actions.share);
  root.querySelector<HTMLButtonElement>('#lenses-result')?.addEventListener('click', actions.lenses);
  root.querySelector<HTMLButtonElement>('#home-result')?.addEventListener('click', actions.home);
  root.querySelector<HTMLButtonElement>('#restart-result')?.addEventListener('click', () => {
    trackEvent('retest_click', { archetypeId: archetype.id });
    dialog?.showModal();
    dialog?.querySelector<HTMLButtonElement>('button[value="cancel"]')?.focus();
  });
  root.querySelector<HTMLButtonElement>('#confirm-reset')?.addEventListener('click', () => {
    session.reset();
    dialog?.close();
    actions.restart();
  });

  window.requestAnimationFrame(() => focusHeading());
}
