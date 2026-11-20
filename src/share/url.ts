const DEFAULT_PUBLIC_BASE_URL = 'https://ypeachee.github.io/ypeachsoul/';

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

export function buildShareUrl(archetypeId: string, baseUrl = getPublicBaseUrl()): string {
  const url = new URL(baseUrl);
  if (!url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }
  url.searchParams.set('utm_source', 'share_card');
  url.searchParams.set('utm_medium', 'image');
  url.searchParams.set('utm_content', archetypeId);
  return url.toString();
}