import { describe, expect, it } from 'vitest';
import { buildJungianCareerProfile, JUNGIAN_FUNCTIONS } from '../../src/knowledge/jungian-career';
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
  completedAt: '2026-11-23T00:00:00.000Z',
};

describe('jungian career profile', () => {
  it('maps the eight archetypes to eight cognitive functions', () => {
    const profile = buildJungianCareerProfile(result);
    expect(JUNGIAN_FUNCTIONS).toHaveLength(8);
    expect(profile.functions).toHaveLength(8);
    expect(new Set(profile.functions.map((item) => item.id)).size).toBe(8);
    expect(Math.round(profile.functions.reduce((sum, item) => sum + item.percentage, 0))).toBe(100);
  });

  it('identifies primary, auxiliary and blind functions deterministically', () => {
    const profile = buildJungianCareerProfile(result);
    expect(profile.primary.id).toBe('Ti');
    expect(profile.auxiliary.id).toBe('Si');
    expect(profile.blind.id).toBe('Ne');
    expect(profile.positioning.title).toBe('复杂系统拆解者');
  });

  it('builds concrete career directions and keeps an observational boundary', () => {
    const profile = buildJungianCareerProfile(result);
    expect(profile.careerDirections).toHaveLength(3);
    expect(profile.careerDirections.every((item) => item.roles.length >= 3)).toBe(true);
    const text = JSON.stringify(profile);
    expect(text).not.toMatch(/命中注定|最适合你的一定|必然成功/);
    expect(text).toContain('职业');
  });
});
