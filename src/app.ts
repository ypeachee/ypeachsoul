import { createSession } from './state/session';
import { createBrowserStorage } from './state/storage';
import { ensureLiveRegion } from './ui/a11y';
import { getRoute, navigate, type Screen } from './ui/router';
import { renderIntro } from './ui/screens/intro';
import { renderQuiz } from './ui/screens/quiz';
import { renderResult } from './ui/screens/result';
import { renderShare } from './ui/screens/share';

export function mountApp(root: HTMLElement): void {
  ensureLiveRegion(root);
  const session = createSession(createBrowserStorage());
  if (!window.location.hash) {
    history.replaceState(null, '', '#intro');
  }

  const rerender = (): void => {
    const route: Screen = getRoute();
    if (route === 'intro') {
      renderIntro(root, session, {
        start(force) {
          if (force) {
            session.reset();
          }
          navigate('quiz');
        },
        viewResult() {
          navigate('result');
        },
      });
      return;
    }
    if (route === 'quiz') {
      if (session.state().result) {
        navigate('result');
        return;
      }
      renderQuiz(root, session, {
        rerender,
        complete() {
          if (session.finish()) {
            navigate('result');
          }
        },
        goIntro() {
          navigate('intro');
        },
      });
      return;
    }
    if (route === 'result') {
      renderResult(root, session, {
        share: () => navigate('share'),
        restart: () => navigate('quiz'),
        home: () => navigate('intro'),
      });
      return;
    }
    if (route === 'share') {
      renderShare(root, session, { close: () => navigate('result') });
      return;
    }
    navigate('intro');
  };

  window.addEventListener('hashchange', rerender);
  rerender();
}