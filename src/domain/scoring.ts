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

  const ranked = [...ARCHETYPE_IDS].sort((a, b) => {
    const scoreDifference = scores[b] - scores[a];
    if (scoreDifference !== 0) {
      return scoreDifference;
    }
    return ARCHETYPE_IDS.indexOf(a) - ARCHETYPE_IDS.indexOf(b);
  });
  const highestScore = scores[ranked[0]];
  const tied = ranked.filter((id) => scores[id] === highestScore);
  const lastQuestion = questions[questions.length - 1];
  const finalOption = lastQuestion.options.find((option) => option.id === answers[lastQuestion.id]);
  const finalHint = finalOption?.archetypeId;
  const archetypeId = finalHint && tied.includes(finalHint)
    ? finalHint
    : ranked[0];
  const secondaryArchetypeId = ranked.find((id) => id !== archetypeId) ?? archetypeId;

  return {
    archetypeId,
    secondaryArchetypeId,
    scores: { ...scores },
    completedAt,
  };
}

export function getArchetype(id: QuizResult['archetypeId']) {
  return archetypes.find((archetype) => archetype.id === id) ?? archetypes[0];
}