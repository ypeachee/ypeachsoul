import { ATTRIBUTION_KEYS, getAttribution, type Attribution } from './attribution';

export const ANALYTICS_EVENTS = [
  'test_start',
  'test_complete',
  'result_view',
  'share_card_open',
  'share_card_download',
  'share_text_copy',
  'retest_click',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export interface AnalyticsOptions {
  archetypeId?: string;
  attribution?: Attribution;
}

interface QueuedEvent {
  name: AnalyticsEventName;
  options: AnalyticsOptions;
}

interface GoatCounterPayload {
  path: string;
  title: string;
  event: boolean;
}

interface GoatCounterApi {
  count(payload: GoatCounterPayload): void;
}

declare global {
  interface Window {
    goatcounter?: GoatCounterApi;
  }
}

const queue: QueuedEvent[] = [];
let initialized = false;

export function buildEventPath(name: AnalyticsEventName, options: AnalyticsOptions = {}): string {
  const params = new URLSearchParams();
  const attribution = options.attribution ?? {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) {
      params.set(key, value);
    }
  }
  if (options.archetypeId) {
    params.set('archetype', options.archetypeId);
  }
  const query = params.toString();
  return `event/${name}${query ? `?${query}` : ''}`;
}

function dispatch(name: AnalyticsEventName, options: AnalyticsOptions): void {
  if (!window.goatcounter?.count) {
    queue.push({ name, options });
    return;
  }
  window.goatcounter.count({
    path: buildEventPath(name, options),
    title: name,
    event: true,
  });
}

function flushQueue(): void {
  if (!window.goatcounter?.count) {
    return;
  }
  for (const event of queue.splice(0)) {
    window.goatcounter.count({
      path: buildEventPath(event.name, event.options),
      title: event.name,
      event: true,
    });
  }
}

export function initAnalytics(): void {
  if (initialized) {
    return;
  }
  initialized = true;
  const endpoint = import.meta.env.VITE_GOATCOUNTER_URL?.trim();
  if (!endpoint) {
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.dataset.goatcounter = endpoint;
  script.src = 'https://gc.zgo.at/count.js';
  script.addEventListener('load', flushQueue, { once: true });
  document.head.append(script);
}

export function trackEvent(name: AnalyticsEventName, options: AnalyticsOptions = {}): void {
  let storage: Storage | undefined;
  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }
  dispatch(name, {
    ...options,
    attribution: options.attribution ?? getAttribution(storage),
  });
}