import { describe, expect, it } from 'vitest';
import { buildShareText } from '../../src/share/text';

describe('share text', () => {
  it('contains the selected archetype and disclaimer', () => {
    const text = buildShareText({
      archetypeId: 'deep-diver',
      scores: {
        'deep-diver': 1,
        stargazer: 0,
        alchemist: 0,
        'dream-weaver': 0,
        architect: 0,
        pathfinder: 0,
        'fire-keeper': 0,
        'wind-chaser': 0,
      },
      completedAt: '2026-11-20T00:00:00.000Z',
    });
    expect(text).toContain('深潜者');
    expect(text).toContain('灵魂使用说明书');
    expect(text).toContain('不构成心理/医疗诊断');
    expect(text).not.toMatch(/一定会|天生注定|科学证明/);
  });
});