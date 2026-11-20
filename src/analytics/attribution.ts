export const ATTRIBUTION_STORAGE_KEY = 'soul_manual_attribution_v1';

export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'ref',
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const memoryByStorage = new WeakMap<object, Attribution>();
let memoryAttribution: Attribution | null = null;

function sanitize(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const cleaned = value
    .trim()
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[^\p{L}\p{N}._~-]+/gu, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return cleaned ? [...cleaned].slice(0, 80).join('') : undefined;
}

export function parseAttribution(search: string): Attribution {
  const params = new URLSearchParams(search);
  const attribution: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = sanitize(params.get(key));
    if (value) {
      attribution[key] = value;
    }
  }
  return attribution;
}

function readStored(storage?: StorageLike): Attribution | null {
  if (!storage) {
    return null;
  }
  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    const attribution: Attribution = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = sanitize(String((parsed as Record<string, unknown>)[key] ?? ''));
      if (value) {
        attribution[key] = value;
      }
    }
    return Object.keys(attribution).length ? attribution : null;
  } catch {
    return null;
  }
}

export function getAttribution(storage?: StorageLike): Attribution {
  const cached = storage ? memoryByStorage.get(storage) : memoryAttribution;
  if (cached && Object.keys(cached).length) {
    return { ...cached };
  }

  const stored = readStored(storage);
  if (stored) {
    if (storage) {
      memoryByStorage.set(storage, stored);
    } else {
      memoryAttribution = stored;
    }
    return { ...stored };
  }
  return {};
}

export function captureAttribution(search: string, storage?: StorageLike): Attribution {
  const incoming = parseAttribution(search);
  if (!Object.keys(incoming).length) {
    return getAttribution(storage);
  }

  const existing = getAttribution(storage);
  if (Object.keys(existing).length) {
    return existing;
  }

  if (storage) {
    memoryByStorage.set(storage, incoming);
  } else {
    memoryAttribution = incoming;
  }
  if (storage) {
    try {
      storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(incoming));
    } catch {
      // The current session still keeps attribution in memory.
    }
  }
  return { ...incoming };
}

export function attributionSource(attribution: Attribution): string | undefined {
  if (attribution.ref) {
    return attribution.ref;
  }
  if (attribution.utm_source && attribution.utm_source !== 'share_card' && attribution.utm_source !== 'share_text') {
    return attribution.utm_source;
  }
  return undefined;
}