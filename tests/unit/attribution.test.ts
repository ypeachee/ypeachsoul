import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTION_STORAGE_KEY,
  captureAttribution,
  getAttribution,
  parseAttribution,
} from '../../src/analytics/attribution';

function createStorage() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe('attribution', () => {
  it('captures supported UTM values and ignores unknown params', () => {
    expect(
      parseAttribution('?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=archetype_01&foo=bar'),
    ).toEqual({
      utm_source: 'xiaohongshu',
      utm_medium: 'social',
      utm_campaign: 'launch_202611',
      utm_content: 'archetype_01',
    });
  });

  it('keeps first-touch attribution across a later campaign visit', () => {
    const storage = createStorage();
    const first = captureAttribution(
      '?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611',
      storage,
    );
    expect(first.utm_source).toBe('xiaohongshu');

    captureAttribution('?utm_source=douyin&utm_medium=video&utm_campaign=later', storage);

    expect(getAttribution(storage).utm_source).toBe('xiaohongshu');
    expect(JSON.parse(storage.values.get(ATTRIBUTION_STORAGE_KEY) ?? '{}').utm_source).toBe('xiaohongshu');
  });

  it('sanitizes and limits untrusted attribution values', () => {
    const parsed = parseAttribution(`?utm_source=${'x'.repeat(100)}%20bad&utm_content=%E6%B5%8B%E8%AF%95`);
    expect(parsed.utm_source).toHaveLength(80);
    expect(parsed.utm_source).not.toContain(' ');
    expect(parsed.utm_content).toBe('测试');
  });
});