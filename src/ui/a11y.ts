let liveRegion: HTMLElement | null = null;

export function ensureLiveRegion(_root: HTMLElement): void {
  liveRegion = document.querySelector<HTMLElement>('#app-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'app-live-region';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.append(liveRegion);
  }
}

export function announce(message: string): void {
  if (!liveRegion) {
    return;
  }
  liveRegion.textContent = '';
  window.setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, 20);
}

export function focusHeading(): void {
  const heading = document.querySelector<HTMLElement>('h1');
  heading?.focus({ preventScroll: false });
}