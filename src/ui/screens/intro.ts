import type { Session } from '../../state/session';
import { trackEvent } from '../../analytics/events';
import { ESTIMATED_MINUTES, LENS_COUNT, METHOD_FRAMEWORK, PRODUCT_NAME, PRODUCT_TAGLINE, QUESTION_COUNT } from '../../product';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface IntroActions {
  start(force: boolean): void;
  viewResult(): void;
}

export function renderIntro(root: HTMLElement, session: Session, actions: IntroActions): void {
  const state = session.state();
  const issue = session.loadIssue();
  const invalidDraft = issue?.kind === 'invalid';
  const hasResult = Boolean(state.result);
  const hasProgress = Object.keys(state.answers).length > 0 && !hasResult;
  const primaryLabel = invalidDraft ? '清空旧草稿并重新开始' : hasResult ? '查看上次结果' : hasProgress ? '继续上次研究' : '开始研究';

  const content = `
    <section class="hero" aria-labelledby="intro-title">
      <p class="eyebrow">A SINGLE-CASE STUDY OF YOU · V3.0</p>
      <h1 id="intro-title" tabindex="-1"><span class="title-line">关于你的</span><span class="title-line">单案例研究</span></h1>
      <p class="lede">${PRODUCT_TAGLINE}</p>
      <div class="meta-row">
        <span>约 ${ESTIMATED_MINUTES} 分钟</span>
        <span>${QUESTION_COUNT} 道题</span>
        <span>无需登录</span>
        <span>${LENS_COUNT} 镜附录</span>
      </div>
      <div class="research-meta" aria-label="研究方法说明">
        <span><strong>研究方法</strong> 单案例自然观察</span>
        <span><strong>方法框架</strong> ${METHOD_FRAMEWORK}</span>
        <span><strong>研究对象</strong> 你 · n=1</span>
      </div>
      ${invalidDraft ? `
        <div class="notice notice-error" role="alert">
          <strong>旧版草稿无法恢复</strong>
          <p>${escapeHtml(issue.reason)}。旧数据会保留到你主动确认清除。</p>
        </div>
      ` : storageBanner(session)}
      <div class="action-row">
        <button class="primary-button" id="intro-primary" type="button">${escapeHtml(primaryLabel)}</button>
        ${hasResult ? '<button class="secondary-button" id="intro-restart" type="button">重新研究</button>' : ''}
      </div>
      <p class="disclaimer">娱乐性自我报告，不构成心理/医疗诊断</p>
    </section>
  `;

  root.innerHTML = screenShell(content, 'intro-shell');
  document.title = PRODUCT_NAME;
  root.querySelector<HTMLButtonElement>('#intro-primary')?.addEventListener('click', () => {
    if (invalidDraft) {
      trackEvent('test_start');
      announce('旧草稿已清除，重新开始研究');
      actions.start(true);
      return;
    }
    if (hasResult) {
      actions.viewResult();
      return;
    }
    session.start(false);
    if (!hasProgress) {
      trackEvent('test_start');
    }
    announce(hasProgress ? '继续上次研究' : '研究开始');
    actions.start(false);
  });
  root.querySelector<HTMLButtonElement>('#intro-restart')?.addEventListener('click', () => {
    actions.start(true);
  });
  window.requestAnimationFrame(() => focusHeading());
}
