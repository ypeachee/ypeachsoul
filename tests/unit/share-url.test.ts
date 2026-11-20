import { describe, expect, it } from 'vitest';
import { buildShareUrl } from '../../src/share/url';

describe('share URL', () => {
  it('adds image share attribution without dropping the base path', () => {
    expect(buildShareUrl('deep-diver', 'https://ypeachee.github.io/ypeachsoul/')).toBe(
      'https://ypeachee.github.io/ypeachsoul/?utm_source=share_card&utm_medium=image&utm_campaign=referral&utm_content=deep-diver',
    );
  });

  it('uses a separate source for copied text and preserves the original referral', () => {
    expect(
      buildShareUrl('deep-diver', 'https://example.com/', { utm_source: 'xiaohongshu' }, 'text'),
    ).toBe(
      'https://example.com/?utm_source=share_text&utm_medium=copy&utm_campaign=referral&utm_content=deep-diver&ref=xiaohongshu',
    );
  });
});