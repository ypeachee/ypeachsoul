import { describe, expect, it } from 'vitest';
import { archetypes } from '../../src/domain/archetypes';
import { questions } from '../../src/domain/questions';
import { scoreAnswers } from '../../src/domain/scoring';

describe('quiz domain', () => {
  it('ships exactly 30 questions and 8 archetypes', () => {
    expect(questions).toHaveLength(30);
    expect(questions.every((question) => question.options.length === 4)).toBe(true);
    expect(new Set(questions.flatMap((question) => question.options.map((option) => option.archetypeId))).size).toBe(8);
    expect(archetypes).toHaveLength(8);
    const counts = Object.fromEntries(archetypes.map((item) => [item.id, 0]));
    for (const question of questions) {
      for (const option of question.options) {
        counts[option.archetypeId] += 1;
      }
    }
    expect(Object.values(counts).every((count) => count === 15)).toBe(true);
  });

  it('is deterministic for the same answers', () => {
    const answers = Object.fromEntries(questions.map((question) => [question.id, question.options[0].id]));
    const first = scoreAnswers(answers);
    const second = scoreAnswers(answers);
    expect(first?.archetypeId).toBe(second?.archetypeId);
    expect(first?.scores).toEqual(second?.scores);
  });

  it('returns null until all questions are answered', () => {
    expect(scoreAnswers({})).toBeNull();
    expect(scoreAnswers({ q1: questions[0].options[0].id })).toBeNull();
    const partial = Object.fromEntries(questions.slice(0, -1).map((question) => [question.id, question.options[0].id]));
    expect(scoreAnswers(partial)).toBeNull();
  });

  it('makes every archetype reachable from a coherent answer set', () => {
    for (const archetype of archetypes) {
      const counts = Object.fromEntries(archetypes.map((item) => [item.id, 0]));
      const answers: Record<string, string> = {};
      for (const question of questions) {
        const target = question.options.find((option) => option.archetypeId === archetype.id);
        const option = target ?? [...question.options].sort((a, b) => counts[a.archetypeId] - counts[b.archetypeId])[0];
        answers[question.id] = option.id;
        counts[option.archetypeId] += 1;
      }
      const result = scoreAnswers(answers);
      expect(result, archetype.id).not.toBeNull();
      expect(result?.scores[archetype.id]).toBe(Math.max(...Object.values(result!.scores)));
      expect(result?.archetypeId, archetype.id).toBe(archetype.id);
      expect(result?.secondaryArchetypeId, archetype.id).not.toBe(archetype.id);
    }
  });
});