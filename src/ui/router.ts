export type Screen = 'intro' | 'quiz' | 'scoring' | 'result' | 'share';

const screens = new Set<Screen>(['intro', 'quiz', 'scoring', 'result', 'share']);

export function getRoute(): Screen {
  const candidate = window.location.hash.replace(/^#/, '') as Screen;
  return screens.has(candidate) ? candidate : 'intro';
}

export function navigate(screen: Screen): void {
  if (getRoute() === screen && window.location.hash === `#${screen}`) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  window.location.hash = screen;
}