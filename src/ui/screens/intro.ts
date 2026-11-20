import type { Session } from '../../state/session';
import { trackEvent } from '../../analytics/events';
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
  const primaryLabel = invalidDraft ? '清空旧草稿并重新开始' : hasResult ? '查看上次结果' : hasProgress ? '继续上次测试' : '开始测试';

  const content = `
    <section class="hero" aria-labelledby="intro-title">
      <p class="eyebrow">A SMALL FIELD GUIDE TO YOURSELF</p>
      <h1 id="intro-title" tabindex="-1">灵魂使用说明书</h1>
      <p class="lede">用十个选择，读一遍你此刻的内在运行方式。</p>
      <div class="meta-row">
        <span>约 90 秒</span>
        <span>10 道题</span>
        <span>无需登录</span>
      </div>
      ${invalidDraft ? `
        <div class="notice notice-error" role="alert">
          <strong>旧草稿无法恢复</strong>
          <p>${escapeHtml(issue.reason)}。旧数据会保留到你主动确认清除。</p>
        </div>
      ` : storageBanner(session)}
      <div class="action-row">
        <button class="primary-button" id="intro-primary" type="button">${escapeHtml(primaryLabel)}</button>
        ${hasResult ? '<button class="secondary-button" id="intro-restart" type="button">重新测试</button>' : ''}
      </div>
      <p class="disclaimer">娱乐与自我反思用途，不构成心理/医疗诊断</p>
    </section>
  `;

  root.innerHTML = screenShell(content, 'intro-shell');
  document.title = '灵魂使用说明书';
  root.querySelector<HTMLButtonElement>('#intro-primary')?.addEventListener('click', () => {
    if (invalidDraft) {
      trackEvent('test_start');
      announce('旧草稿已清除，重新开始');
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
    announce(hasProgress ? '继续上次测试' : '测试开始');
    actions.start(false);
  });
  root.querySelector<HTMLButtonElement>('#intro-restart')?.addEventListener('click', () => {
    actions.start(true);
  });
  window.requestAnimationFrame(() => focusHeading());
}