import { captureAttribution } from './analytics/attribution';
import { initAnalytics, trackEvent } from './analytics/events';
import { createSession } from './state/session';
import { createBrowserStorage } from './state/storage';
import { ensureLiveRegion } from './ui/a11y';
import { getRoute, navigate, type Screen } from './ui/router';
import { renderIntro } from './ui/screens/intro';
import { renderQuiz } from './ui/screens/quiz';
import { renderResult } from './ui/screens/result';
import { renderShare } from './ui/screens/share';
import { renderLenses } from './ui/screens/lenses';
import { renderTarot } from './ui/screens/tarot';
import { renderBazi } from './ui/screens/bazi';

export function mountApp(root: HTMLElement): void {
  ensureLiveRegion(root);
  try {
    captureAttribution(window.location.search, window.localStorage);
  } catch {
    captureAttribution(window.location.search);
  }
  initAnalytics();
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
          const result = session.finish();
          if (result) {
            trackEvent('test_complete', { archetypeId: result.archetypeId });
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
        lenses: () => navigate('lenses'),
        restart: () => navigate('quiz'),
        home: () => navigate('intro'),
      });
      return;
    }
    if (route === 'share') {
      renderShare(root, session, { close: () => navigate('result') });
      return;
    }
    if (route === 'lenses') {
      renderLenses(root, session, {
        close: () => navigate('result'),
        share: () => navigate('share'),
      });
      return;
    }
    if (route === 'tarot') {
      if (!session.state().result) {
        navigate('intro');
        return;
      }
      renderTarot(root, session, {
        back: () => navigate('lenses'),
        lenses: () => navigate('lenses'),
      });
      return;
    }
    if (route === 'bazi') {
      if (!session.state().result) {
        navigate('intro');
        return;
      }
      renderBazi(root, session, {
        back: () => navigate('lenses'),
        lenses: () => navigate('lenses'),
      });
      return;
    }
    navigate('intro');
  };

  window.addEventListener('hashchange', rerender);
  rerender();
}