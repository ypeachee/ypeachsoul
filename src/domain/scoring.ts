import { archetypes } from './archetypes';
import { questions } from './questions';
import { ARCHETYPE_IDS, type AnswerMap, type ArchetypeScores, type QuizResult } from './types';

export function scoreAnswers(answers: AnswerMap, completedAt = new Date().toISOString()): QuizResult | null {
  const scores = Object.fromEntries(ARCHETYPE_IDS.map((id) => [id, 0])) as ArchetypeScores;

  for (const question of questions) {
    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
    if (!selectedOption) {
      return null;
    }
    scores[selectedOption.archetypeId] += 1;
  }

  const highestScore = Math.max(...Object.values(scores));
  const tied = ARCHETYPE_IDS.filter((id) => scores[id] === highestScore);
  const finalOption = questions[9].options.find((option) => option.id === answers[questions[9].id]);
  const finalHint = finalOption?.archetypeId;
  const archetypeId = finalHint && tied.includes(finalHint)
    ? finalHint
    : tied[0];

  return {
    archetypeId: archetypeId ?? ARCHETYPE_IDS[0],
    scores: { ...scores },
    completedAt,
  };
}

export function getArchetype(id: QuizResult['archetypeId']) {
  return archetypes.find((archetype) => archetype.id === id) ?? archetypes[0];
}