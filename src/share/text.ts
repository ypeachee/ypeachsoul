import { getArchetype } from '../domain/scoring';
import type { QuizResult } from '../domain/types';

export function buildShareText(result: QuizResult, landingUrl?: string): string {
  const archetype = getArchetype(result.archetypeId);
  const lines = [
    `我的灵魂原型是：${archetype.name}`,
    archetype.tagline,
    `关键词：${archetype.keywords.join(' · ')}`,
    '',
    '来做你的《灵魂使用说明书》',
  ];
  if (landingUrl) {
    lines.push(landingUrl);
  }
  lines.push('娱乐与自我反思用途，不构成心理/医疗诊断');
  return lines.join('\n');
}