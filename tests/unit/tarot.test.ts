import { describe, expect, it } from 'vitest';
import { FULL_TAROT_DECK, createTarotReading } from '../../src/knowledge/tarot';

describe('interactive tarot lens', () => {
  it('contains a complete unique 78-card deck', () => {
    expect(FULL_TAROT_DECK).toHaveLength(78);
    expect(new Set(FULL_TAROT_DECK.map((card) => card.id)).size).toBe(78);
  });

  it('is reproducible with a seed and never repeats a card', () => {
    const first = createTarotReading('我下一步应该先处理什么？', 20261123);
    const second = createTarotReading('我下一步应该先处理什么？', 20261123);
    expect(first).toEqual(second);
    expect(first.cards).toHaveLength(3);
    expect(new Set(first.cards.map((card) => card.id)).size).toBe(3);
    expect(first.cards.map((card) => card.position)).toEqual(['当下', '张力', '下一步']);
  });

  it('frames the result as reflection instead of prediction', () => {
    const reading = createTarotReading('', 7);
    const text = `${reading.overview} ${reading.story} ${reading.action} ${reading.closing}`;
    expect(text).toContain('选择');
    expect(text).not.toMatch(/命中注定|一定会|必然发生/);
  });
});
