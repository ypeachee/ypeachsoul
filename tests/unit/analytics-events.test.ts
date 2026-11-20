import { describe, expect, it } from 'vitest';
import { buildEventPath } from '../../src/analytics/events';

describe('analytics events', () => {
  it('builds an event path with attribution and archetype context', () => {
    expect(
      buildEventPath('share_card_download', {
        archetypeId: 'deep-diver',
        attribution: {
          utm_source: 'xiaohongshu',
          utm_medium: 'social',
          utm_campaign: 'launch_202611',
        },
      }),
    ).toBe(
      'event/share_card_download?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&archetype=deep-diver',
    );
  });

  it('omits empty attribution fields', () => {
    expect(buildEventPath('test_start', { attribution: {} })).toBe('event/test_start');
  });
});