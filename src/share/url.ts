import { attributionSource, type Attribution } from '../analytics/attribution';

const DEFAULT_PUBLIC_BASE_URL = 'https://ypeachee.github.io/ypeachsoul/';

export type ShareMedium = 'image' | 'text';

export function getPublicBaseUrl(): string {
  const configured = import.meta.env.VITE_PUBLIC_BASE_URL?.trim();
  if (configured) {
    return configured.endsWith('/') ? configured : `${configured}/`;
  }
  if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
    return new URL(import.meta.env.BASE_URL, window.location.origin).toString();
  }
  return DEFAULT_PUBLIC_BASE_URL;
}

export function buildShareUrl(
  archetypeId: string,
  baseUrl = getPublicBaseUrl(),
  attribution: Attribution = {},
  medium: ShareMedium = 'image',
): string {
  const url = new URL(baseUrl);
  if (!url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }
  url.searchParams.set('utm_source', medium === 'image' ? 'share_card' : 'share_text');
  url.searchParams.set('utm_medium', medium === 'image' ? 'image' : 'copy');
  url.searchParams.set('utm_campaign', 'referral');
  url.searchParams.set('utm_content', archetypeId);
  const ref = attributionSource(attribution);
  if (ref) {
    url.searchParams.set('ref', ref);
  }
  return url.toString();
}