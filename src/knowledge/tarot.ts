export type TarotOrientation = '正位' | '逆位';
export type TarotElement = '风' | '水' | '土' | '火';
export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotDraw {
  name: string;
  orientation: TarotOrientation;
  meaning: string;
}

export interface TarotCardDefinition {
  id: string;
  name: string;
  arcana: '大阿卡纳' | '小阿卡纳';
  suit: TarotSuit;
  element: TarotElement;
  upright: string;
  reversed: string;
}

export interface TarotReadingCard extends TarotCardDefinition {
  position: string;
  orientation: TarotOrientation;
  meaning: string;
}

export interface TarotReading {
  seed: number;
  timeFactor: 'morning' | 'afternoon' | 'night';
  question: string;
  cards: TarotReadingCard[];
  overview: string;
  story: string;
  action: string;
  closing: string;
}

const MAJOR_ARCANA: ReadonlyArray<{
  name: string;
  element: TarotElement;
  upright: string;
  reversed: string;
}> = [
  { name: '愚者', element: '风', upright: '信任未知，允许一个新的开始', reversed: '先确认脚下，再决定跳向哪里' },
  { name: '魔术师', element: '风', upright: '把已有的资源组合成行动', reversed: '不要用技巧遮住真正的意图' },
  { name: '女祭司', element: '水', upright: '给直觉留出安静的空间', reversed: '直觉需要被事实校验' },
  { name: '皇后', element: '土', upright: '滋养一个正在生长的东西', reversed: '先照顾自己，再照顾所有人' },
  { name: '皇帝', element: '火', upright: '建立边界、规则与可执行结构', reversed: '结构过硬时，关系会失去弹性' },
  { name: '教皇', element: '土', upright: '向传统与方法学习', reversed: '不要把他人的答案当成自己的答案' },
  { name: '恋人', element: '风', upright: '在连接中做一次真实选择', reversed: '选择困难可能来自价值冲突' },
  { name: '战车', element: '水', upright: '集中意志，向前推进', reversed: '速度不能替代方向' },
  { name: '力量', element: '火', upright: '温柔而坚定地处理冲突', reversed: '压抑的力量会以别的方式回来' },
  { name: '隐者', element: '土', upright: '独处、复盘、寻找内在光源', reversed: '独处太久会变成回避' },
  { name: '命运之轮', element: '火', upright: '承认周期与变化', reversed: '不要把所有变化都解释成命运' },
  { name: '正义', element: '风', upright: '检查因果、责任与公平', reversed: '在判断前补齐缺失的信息' },
  { name: '倒吊人', element: '水', upright: '暂停，换一个角度', reversed: '暂停不是永久停滞' },
  { name: '死神', element: '水', upright: '让一个阶段真正结束', reversed: '抗拒结束会延长消耗' },
  { name: '节制', element: '火', upright: '调配节奏，寻找中间路径', reversed: '极端投入需要被重新平衡' },
  { name: '恶魔', element: '土', upright: '看见让你上瘾的模式', reversed: '承认执着，才有松开的可能' },
  { name: '塔', element: '火', upright: '让不稳固的结构显露问题', reversed: '不必靠一次崩塌才开始修整' },
  { name: '星星', element: '风', upright: '保留希望，也保留长期行动', reversed: '希望需要落在具体的小事上' },
  { name: '月亮', element: '水', upright: '辨认模糊感受与想象', reversed: '把猜测和事实分开核对' },
  { name: '太阳', element: '火', upright: '让真实、清晰和活力被看见', reversed: '过度曝光也会消耗能量' },
  { name: '审判', element: '火', upright: '复盘过去，回应新的召唤', reversed: '不要用自我审判代替行动' },
  { name: '世界', element: '土', upright: '完成一个循环，整合经验', reversed: '完成前还需要处理一个未结项' },
];

const SUITS: ReadonlyArray<{
  key: Exclude<TarotSuit, 'major'>;
  name: string;
  element: TarotElement;
  focus: string;
  upright: string;
  reversed: string;
}> = [
  {
    key: 'wands',
    name: '权杖',
    element: '火',
    focus: '行动、创造与意志',
    upright: '把能量落到一个具体动作上',
    reversed: '先检查行动是否只是在逃避思考',
  },
  {
    key: 'cups',
    name: '圣杯',
    element: '水',
    focus: '情绪、关系与直觉',
    upright: '承认真实感受，再决定如何回应',
    reversed: '别让未被说出的期待替你做决定',
  },
  {
    key: 'swords',
    name: '宝剑',
    element: '风',
    focus: '思考、沟通与冲突',
    upright: '用更清晰的语言切开问题',
    reversed: '过度分析可能让行动继续停在原地',
  },
  {
    key: 'pentacles',
    name: '星币',
    element: '土',
    focus: '身体、资源与长期积累',
    upright: '回到资源、节奏和可持续性',
    reversed: '先确认投入是否真的能长期维持',
  },
];

const RANKS: ReadonlyArray<{
  key: string;
  name: string;
  upright: string;
  reversed: string;
}> = [
  { key: 'ace', name: 'Ace', upright: '一个种子或机会正在出现', reversed: '机会已经有了，但还没有落地' },
  { key: 'two', name: '二', upright: '需要在两个方向之间做选择', reversed: '犹豫正在消耗选择的能量' },
  { key: 'three', name: '三', upright: '合作、反馈或初步成果出现', reversed: '进展需要重新对齐参与者' },
  { key: 'four', name: '四', upright: '结构开始稳定，也可能变得僵化', reversed: '稳定感需要一点松动' },
  { key: 'five', name: '五', upright: '摩擦、损失或现实阻力被看见', reversed: '冲突之后仍有机会修复' },
  { key: 'six', name: '六', upright: '恢复、互惠与重新连接', reversed: '恢复需要先承认失去的部分' },
  { key: 'seven', name: '七', upright: '进入考验，需要耐心与判断', reversed: '不要把等待误认成停滞' },
  { key: 'eight', name: '八', upright: '进入加速练习或重复推进', reversed: '节奏需要降下来，避免机械用力' },
  { key: 'nine', name: '九', upright: '接近完成，但负担也在累积', reversed: '最后一公里需要重新分配重量' },
  { key: 'ten', name: '十', upright: '一个阶段完成，也可能进入过载', reversed: '结束之前先卸掉不必要的责任' },
  { key: 'page', name: '侍从', upright: '保持好奇，开始学习', reversed: '先确认自己是否真的愿意练习' },
  { key: 'knight', name: '骑士', upright: '带着承诺向前移动', reversed: '速度过快时需要重新校准方向' },
  { key: 'queen', name: '皇后', upright: '用滋养和容纳推进事情', reversed: '照顾别人之前先补充自己' },
  { key: 'king', name: '国王', upright: '承担掌控与长期责任', reversed: '控制感过强时，合作会失去空间' },
];

const MAJOR_DECK: TarotCardDefinition[] = MAJOR_ARCANA.map((card, index) => ({
  id: `major-${index}`,
  name: card.name,
  arcana: '大阿卡纳',
  suit: 'major',
  element: card.element,
  upright: card.upright,
  reversed: card.reversed,
}));

const MINOR_DECK: TarotCardDefinition[] = SUITS.flatMap((suit) => RANKS.map((rank) => ({
  id: `${suit.key}-${rank.key}`,
  name: `${suit.name}${rank.name}`,
  arcana: '小阿卡纳',
  suit: suit.key,
  element: suit.element,
  upright: `${rank.upright}，重点在${suit.focus}：${suit.upright}`,
  reversed: `${rank.reversed}，重点在${suit.focus}：${suit.reversed}`,
})));

export const FULL_TAROT_DECK: readonly TarotCardDefinition[] = [...MAJOR_DECK, ...MINOR_DECK];

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function secureSeed(): number {
  const values = new Uint32Array(1);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return values[0] || 1;
  }
  return (Date.now() ^ Math.floor(Math.random() * 4294967295)) >>> 0 || 1;
}

export function currentTimeFactor(hour = new Date().getHours()): TarotReading['timeFactor'] {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
}

export function drawMajorArcana(seedText: string, count = 3): TarotDraw[] {
  const random = mulberry32(hashString(seedText));
  const pool = [...MAJOR_ARCANA];
  const draws: TarotDraw[] = [];
  for (let index = 0; index < count; index += 1) {
    const cardIndex = Math.floor(random() * pool.length);
    const card = pool.splice(cardIndex, 1)[0];
    const orientation: TarotOrientation = random() > 0.34 ? '正位' : '逆位';
    draws.push({
      name: card.name,
      orientation,
      meaning: orientation === '正位' ? card.upright : card.reversed,
    });
  }
  return draws;
}

export function createTarotReading(question: string, seed = secureSeed()): TarotReading {
  const normalizedQuestion = question.trim().slice(0, 120);
  const random = mulberry32(seed);
  const pool = [...FULL_TAROT_DECK];
  const positions = ['当下', '张力', '下一步'];
  const cards: TarotReadingCard[] = [];

  for (let index = 0; index < positions.length; index += 1) {
    const cardIndex = index + Math.floor(random() * (pool.length - index));
    [pool[index], pool[cardIndex]] = [pool[cardIndex], pool[index]];
    const card = pool[index];
    const orientation: TarotOrientation = random() < 0.6 ? '正位' : '逆位';
    cards.push({
      ...card,
      position: positions[index],
      orientation,
      meaning: orientation === '正位' ? card.upright : card.reversed,
    });
  }

  const majorCount = cards.filter((card) => card.suit === 'major').length;
  const dominantElement = ['火', '水', '风', '土'].map((element) => ({
    element,
    count: cards.filter((card) => card.element === element).length,
  })).sort((left, right) => right.count - left.count)[0];

  return {
    seed,
    timeFactor: currentTimeFactor(),
    question: normalizedQuestion,
    cards,
    overview: majorCount >= 2
      ? '这次三张牌里，大阿卡纳占多数。它更像一次结构性的转折提示，而不是对日常细节的评判。'
      : `三张牌的元素重心落在「${dominantElement.element}」。先用它观察当下，不急着把它解释成命运。`,
    story: `${cards[0].name}${cards[0].orientation}把故事起点放在「${cards[0].meaning}」；${cards[1].name}${cards[1].orientation}提示「${cards[1].meaning}」；${cards[2].name}${cards[2].orientation}把出口指向「${cards[2].meaning}」。`,
    action: `从「${cards[2].meaning}」里挑一个今天 15 分钟内能完成的小动作，并写下完成后的感受。`,
    closing: '牌面提供的是一组当下叙事，你的选择随时可以改变下一步。',
  };
}
