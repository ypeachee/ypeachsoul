import { getArchetype } from '../domain/scoring';
import type { QuizResult } from '../domain/types';
import { PRODUCT_NAME } from '../product';

export function buildShareText(result: QuizResult, landingUrl?: string): string {
  const primary = getArchetype(result.archetypeId);
  const secondary = getArchetype(result.secondaryArchetypeId);
  const lines = [
    `《${PRODUCT_NAME}》`,
    '研究对象：我 · 样本量：n=1',
    `研究结论：${primary.name} × ${secondary.name}`,
    `竞争解释：${secondary.name}`,
    primary.tagline,
    `运行参数：${primary.keywords.join(' · ')}`,
    '六镜附录：奇门/紫微 · 八字 · 月老 · 佛学 · 风水 · 塔罗',
    '',
    `来做你的《${PRODUCT_NAME}》`,
  ];
  if (landingUrl) {
    lines.push(landingUrl);
  }
  lines.push('娱乐性自我报告，不构成心理/医疗诊断、命理预测或现实决策依据');
  return lines.join('\n');
}
