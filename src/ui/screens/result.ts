import { getArchetype } from '../../domain/scoring';
import type { Session } from '../../state/session';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface ResultActions {
  share(): void;
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
  const advantages = archetype.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const blindSpots = archetype.blindSpots.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  const content = `
    ${storageBanner(session)}
    <article class="result-card" style="--archetype-accent:${escapeHtml(archetype.accent)}">
      <header class="result-hero">
        <p class="eyebrow">YOUR ARCHETYPE</p>
        <h1 tabindex="-1">你的原型</h1>
        <p class="result-name">${escapeHtml(archetype.name)}</p>
        <p class="result-tagline">${escapeHtml(archetype.tagline)}</p>
        <ul class="keyword-list" aria-label="核心关键词">
          ${archetype.keywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join('')}
        </ul>
      </header>

      <div class="result-grid">
        <section class="result-section">
          <h2>三个优势</h2>
          <ul>${advantages}</ul>
        </section>
        <section class="result-section">
          <h2>两个盲点</h2>
          <ul>${blindSpots}</ul>
        </section>
        <section class="result-section result-section-wide">
          <h2>关系模式</h2>
          <p>${escapeHtml(archetype.relationship)}</p>
        </section>
        <section class="result-section result-section-wide">
          <h2>工作与能量</h2>
          <p>${escapeHtml(archetype.work)}</p>
        </section>
        <section class="result-section result-action-card result-section-wide">
          <h2>此刻的行动</h2>
          <p>${escapeHtml(archetype.action)}</p>
        </section>
      </div>

      <div class="result-actions">
        <button class="primary-button" id="share-result" type="button">生成分享卡</button>
        <button class="secondary-button" id="restart-result" type="button">重新测试</button>
        <button class="text-button" id="home-result" type="button">返回首页</button>
      </div>
    </article>

    <dialog class="confirm-dialog" id="reset-dialog" aria-labelledby="reset-title">
      <div class="dialog-body">
        <p class="eyebrow">RESET THE READING</p>
        <h2 id="reset-title">清除当前结果？</h2>
        <p>这会删除本次答案和结果。操作完成后会从第一题重新开始。</p>
        <div class="dialog-actions">
          <button class="secondary-button" value="cancel" formmethod="dialog">取消</button>
          <button class="danger-button" id="confirm-reset" type="button">确认重新测试</button>
        </div>
      </div>
    </dialog>

    <p class="global-disclaimer">娱乐与自我反思用途，不构成心理/医疗诊断</p>
  `;

  root.innerHTML = screenShell(content, 'result-shell');
  document.title = `${archetype.name} · 灵魂使用说明书`;
  announce(`你的原型是${archetype.name}`);

  const dialog = root.querySelector<HTMLDialogElement>('#reset-dialog');
  root.querySelector<HTMLButtonElement>('#share-result')?.addEventListener('click', actions.share);
  root.querySelector<HTMLButtonElement>('#home-result')?.addEventListener('click', actions.home);
  root.querySelector<HTMLButtonElement>('#restart-result')?.addEventListener('click', () => {
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