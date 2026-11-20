import { questions } from '../../domain/questions';
import type { Session } from '../../state/session';
import { announce, focusHeading } from '../a11y';
import { escapeHtml, screenShell, storageBanner } from '../components';

export interface QuizActions {
  rerender(): void;
  complete(): void;
  goIntro(): void;
}

export function renderQuiz(root: HTMLElement, session: Session, actions: QuizActions): void {
  const state = session.state();
  const question = questions[state.currentQuestion] ?? questions[0];
  const selectedOptionId = state.answers[question.id];
  const isLast = state.currentQuestion === questions.length - 1;

  const options = question.options.map((option) => `
    <label class="option-card">
      <input type="radio" name="${question.id}" value="${option.id}" ${selectedOptionId === option.id ? 'checked' : ''} />
      <span class="option-index" aria-hidden="true"></span>
      <span class="option-text">${escapeHtml(option.label)}</span>
    </label>
  `).join('');

  const content = `
    ${storageBanner(session)}
    <section class="quiz-card" aria-labelledby="question-title">
      <div class="quiz-toolbar">
        <button class="text-button" id="quiz-exit" type="button">退出</button>
        <p class="progress-label">${state.currentQuestion + 1} / ${questions.length}</p>
        <span class="progress-track" aria-hidden="true"><span style="width:${((state.currentQuestion + 1) / questions.length) * 100}%"></span></span>
      </div>
      <p class="eyebrow">CHOOSE THE ANSWER THAT FEELS CLOSEST</p>
      <h1 id="question-title" tabindex="-1">${escapeHtml(question.prompt)}</h1>
      <form id="quiz-form">
        <fieldset class="option-list">
          <legend class="sr-only">${escapeHtml(question.prompt)}</legend>
          ${options}
        </fieldset>
        <div class="quiz-actions">
          <button class="secondary-button" id="quiz-previous" type="button" ${state.currentQuestion === 0 ? 'disabled' : ''}>上一题</button>
          <button class="primary-button" id="quiz-next" type="submit" ${selectedOptionId ? '' : 'disabled'}>${isLast ? '查看结果' : '下一题'}</button>
        </div>
      </form>
    </section>
  `;

  root.innerHTML = screenShell(content, 'quiz-shell');
  document.title = `${state.currentQuestion + 1}/${questions.length} · 灵魂使用说明书`;
  announce(`第 ${state.currentQuestion + 1} 题，共 ${questions.length} 题`);

  const form = root.querySelector<HTMLFormElement>('#quiz-form');
  const nextButton = root.querySelector<HTMLButtonElement>('#quiz-next');
  root.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      session.answer(question.id, input.value);
      if (nextButton) {
        nextButton.disabled = false;
      }
    });
  });

  root.querySelector<HTMLButtonElement>('#quiz-previous')?.addEventListener('click', () => {
    session.previous();
    actions.rerender();
  });
  root.querySelector<HTMLButtonElement>('#quiz-exit')?.addEventListener('click', actions.goIntro);
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const chosen = form.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    if (!chosen || !nextButton) {
      return;
    }
    nextButton.disabled = true;
    if (isLast) {
      actions.complete();
      return;
    }
    session.next();
    actions.rerender();
  });

  window.requestAnimationFrame(() => focusHeading());
}