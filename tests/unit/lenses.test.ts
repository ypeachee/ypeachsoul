import { describe, expect, it } from 'vitest';
import { buildLensReadings, LENS_DEFINITIONS } from '../../src/knowledge/lenses';
import type { QuizResult } from '../../src/domain/types';

const result: QuizResult = {
  archetypeId: 'architect',
  secondaryArchetypeId: 'deep-diver',
  scores: {
    'deep-diver': 12,
    stargazer: 4,
    alchemist: 2,
    'dream-weaver': 1,
    architect: 15,
    pathfinder: 8,
    'fire-keeper': 3,
    'wind-chaser': 5,
  },
  completedAt: '2026-11-22T00:00:00.000Z',
};

describe('six-lens appendix', () => {
  it('builds all six lenses deterministically', () => {
    expect(LENS_DEFINITIONS).toHaveLength(6);
    const first = buildLensReadings(result);
    const second = buildLensReadings(result);
    expect(first).toHaveLength(6);
    expect(first).toEqual(second);
    expect(first.map((lens) => lens.id)).toEqual([
      'qimen-ziwei',
      'bazi',
      'yinyuan',
      'buddhist',
      'fengshui',
      'tarot',
    ]);
  });

  it('draws three unique tarot cards and keeps source/license provenance', () => {
    const lenses = buildLensReadings(result);
    const tarot = lenses.find((lens) => lens.id === 'tarot');
    expect(tarot?.tarot).toHaveLength(3);
    expect(new Set(tarot?.tarot?.map((card) => card.name)).size).toBe(3);
    expect(lenses.every((lens) => lens.sourceUrl.startsWith('https://github.com/'))).toBe(true);
    expect(lenses.find((lens) => lens.id === 'bazi')?.license).toBe('MIT');
    expect(lenses.find((lens) => lens.id === 'tarot')?.license).toBe('MIT');
  });

  it('keeps the reading framed as reflection rather than prediction', () => {
    const text = buildLensReadings(result).map((lens) => `${lens.observation} ${lens.question}`).join(' ');
    expect(text).toContain('竞争解释');
    expect(text).not.toMatch(/命中注定|一定会|必然发生/);
  });
});
