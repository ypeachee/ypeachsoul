import { describe, expect, it } from 'vitest';
import { buildShareUrl } from '../../src/share/url';

describe('share URL', () => {
  it('adds fixed share-card attribution without dropping the base path', () => {
    expect(buildShareUrl('deep-diver', 'https://ypeachee.github.io/ypeachsoul/')).toBe(
      'https://ypeachee.github.io/ypeachsoul/?utm_source=share_card&utm_medium=image&utm_content=deep-diver',
    );
  });
});