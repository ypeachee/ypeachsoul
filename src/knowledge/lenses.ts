import { getArchetype } from '../domain/scoring';
import { ARCHETYPE_IDS, type ArchetypeId, type QuizResult } from '../domain/types';

export type LensId = 'qimen-ziwei' | 'bazi' | 'yinyuan' | 'buddhist' | 'fengshui' | 'tarot';

export interface TarotDraw {
  name: string;
  orientation: '正位' | '逆位';
  meaning: string;
}

export interface LensReading {
  id: LensId;
  title: string;
  kicker: string;
  sourceLabel: string;
  sourceUrl: string;
  license: string;
  method: string;
  observation: string;
  question: string;
  practice: string;
  tarot?: TarotDraw[];
}

interface LensDefinition {
  id: LensId;
  title: string;
  kicker: string;
  sourceLabel: string;
  sourceUrl: string;
  license: string;
  method: string;
}

export const LENS_DEFINITIONS: readonly LensDefinition[] = [
  {
    id: 'qimen-ziwei',
    title: '奇门 / 紫微',
    kicker: '时空坐标',
    sourceLabel: 'FANzR-arch/Numerologist_skills',
    sourceUrl: 'https://github.com/FANzR-arch/Numerologist_skills',
    license: '未声明许可证，仅作方法论参考',
    method: '以“先定位、再解释”为原则，把当前问题还原为时间、位置与角色三个观察维度。',
  },
  {
    id: 'bazi',
    title: '八字',
    kicker: '元素节律',
    sourceLabel: 'jinchenma94/bazi-skill',
    sourceUrl: 'https://github.com/jinchenma94/bazi-skill',
    license: 'MIT',
    method: '借用五行与四柱的结构化思路，把行为偏好翻译成元素隐喻；不进行真实排盘。',
  },
  {
    id: 'yinyuan',
    title: '月老',
    kicker: '关系镜像',
    sourceLabel: 'Ming-H/yinyuan-skills',
    sourceUrl: 'https://github.com/Ming-H/yinyuan-skills',
    license: '未声明许可证，仅作方法论参考',
    method: '把关系问题拆成期待、边界与回应节奏，避免把一次互动解释成命运。',
  },
  {
    id: 'buddhist',
    title: '佛学',
    kicker: '执着检查',
    sourceLabel: 'xr843/Master-skill',
    sourceUrl: 'https://github.com/xr843/Master-skill',
    license: 'NOASSERTION，仅作方法论参考',
    method: '以来源意识、边界意识和“不把解释当事实”为原则，做一次轻量的执着检查。',
  },
  {
    id: 'fengshui',
    title: '风水',
    kicker: '环境摩擦',
    sourceLabel: 'voidforall/fengshui.skill',
    sourceUrl: 'https://github.com/voidforall/fengshui.skill',
    license: '未声明许可证，仅作方法论参考',
    method: '把“运势”翻译成环境摩擦：观察空间、动线与未完成任务如何消耗注意力。',
  },
  {
    id: 'tarot',
    title: '塔罗',
    kicker: '叙事抽牌',
    sourceLabel: 'daman-ovo-0404/tarot-skill',
    sourceUrl: 'https://github.com/daman-ovo-0404/tarot-skill',
    license: 'MIT',
    method: '使用大阿卡纳的象征语言做三牌叙事练习；牌面由本地种子确定，不构成预测。',
  },
];

const MAJOR_ARCANA: ReadonlyArray<{ name: string; upright: string; reversed: string }> = [
  { name: '愚者', upright: '信任未知，允许一个新的开始', reversed: '先确认脚下，再决定跳向哪里' },
  { name: '魔术师', upright: '把已有的资源组合成行动', reversed: '不要用技巧遮住真正的意图' },
  { name: '女祭司', upright: '给直觉留出安静的空间', reversed: '直觉需要被事实校验' },
  { name: '皇后', upright: '滋养一个正在生长的东西', reversed: '先照顾自己，再照顾所有人' },
  { name: '皇帝', upright: '建立边界、规则与可执行结构', reversed: '结构过硬时，关系会失去弹性' },
  { name: '教皇', upright: '向传统与方法学习', reversed: '不要把他人的答案当成自己的答案' },
  { name: '恋人', upright: '在连接中做一次真实选择', reversed: '选择困难可能来自价值冲突' },
  { name: '战车', upright: '集中意志，向前推进', reversed: '速度不能替代方向' },
  { name: '力量', upright: '温柔而坚定地处理冲突', reversed: '压抑的力量会以别的方式回来' },
  { name: '隐者', upright: '独处、复盘、寻找内在光源', reversed: '独处太久会变成回避' },
  { name: '命运之轮', upright: '承认周期与变化', reversed: '不要把所有变化都解释成命运' },
  { name: '正义', upright: '检查因果、责任与公平', reversed: '在判断前补齐缺失的信息' },
  { name: '倒吊人', upright: '暂停，换一个角度', reversed: '暂停不是永久停滞' },
  { name: '死神', upright: '让一个阶段真正结束', reversed: '抗拒结束会延长消耗' },
  { name: '节制', upright: '调配节奏，寻找中间路径', reversed: '极端投入需要被重新平衡' },
  { name: '恶魔', upright: '看见让你上瘾的模式', reversed: '承认执着，才有松开的可能' },
  { name: '塔', upright: '让不稳固的结构显露问题', reversed: '小修小补可能拖延真正的重建' },
  { name: '星星', upright: '在失望之后重新连接希望', reversed: '希望需要具体行动承接' },
  { name: '月亮', upright: '允许模糊，辨认情绪与投射', reversed: '迷雾中先不要做不可逆决定' },
  { name: '太阳', upright: '清晰、活力与可见性', reversed: '过度曝光也会消耗能量' },
  { name: '审判', upright: '复盘过去，回应新的召唤', reversed: '不要用自我审判代替行动' },
  { name: '世界', upright: '完成一个循环，整合经验', reversed: '完成前还需要处理一个未结项' },
];

const ELEMENT_BY_ARCHETYPE: Record<ArchetypeId, string> = {
  'deep-diver': '水',
  stargazer: '木',
  alchemist: '火',
  'dream-weaver': '木',
  architect: '金',
  pathfinder: '火',
  'fire-keeper': '土',
  'wind-chaser': '木',
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string): () => number {
  let state = hashString(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

function drawTarot(seed: string): TarotDraw[] {
  const random = seededRandom(seed);
  const pool = [...MAJOR_ARCANA];
  const draws: TarotDraw[] = [];
  for (let index = 0; index < 3; index += 1) {
    const cardIndex = Math.floor(random() * pool.length);
    const card = pool.splice(cardIndex, 1)[0];
    const orientation = random() > 0.34 ? '正位' : '逆位';
    draws.push({
      name: card.name,
      orientation,
      meaning: orientation === '正位' ? card.upright : card.reversed,
    });
  }
  return draws;
}

export function buildLensReadings(result: QuizResult): LensReading[] {
  const primary = getArchetype(result.archetypeId);
  const secondary = getArchetype(result.secondaryArchetypeId);
  const seed = [
    result.completedAt,
    result.archetypeId,
    result.secondaryArchetypeId,
    ...ARCHETYPE_IDS.map((id) => `${id}:${result.scores[id]}`),
  ].join('|');
  const random = seededRandom(seed);
  const primaryElement = ELEMENT_BY_ARCHETYPE[primary.id];
  const secondaryElement = ELEMENT_BY_ARCHETYPE[secondary.id];
  const qimenWindow = pick(['清晨', '午后', '傍晚', '夜间'], random);
  const qimenDirection = pick(['向内', '向外', '向上', '向前'], random);
  const tarot = drawTarot(`${seed}|tarot`);

  return [
    {
      id: 'qimen-ziwei',
      title: '奇门 / 紫微',
      kicker: '时空坐标',
      sourceLabel: 'FANzR-arch/Numerologist_skills',
      sourceUrl: 'https://github.com/FANzR-arch/Numerologist_skills',
      license: '未声明许可证，仅作方法论参考',
      method: '以“先定位、再解释”为原则，把当前问题还原为时间、位置与角色三个观察维度。',
      observation: `${primary.name}的主场更像一个“${qimenWindow}的${qimenDirection}场”，而${secondary.name}提供了另一种竞争解释。先确认你此刻是在等待时机，还是在借“时机”推迟行动。`,
      question: '如果不对未来做预测，只观察接下来 24 小时的时机、位置与角色，你会改变哪一个动作？',
      practice: `给自己设一个${qimenWindow}的观察窗口，只记录事实，不解释命运。`,
    },
    {
      id: 'bazi',
      title: '八字',
      kicker: '元素节律',
      sourceLabel: 'jinchenma94/bazi-skill',
      sourceUrl: 'https://github.com/jinchenma94/bazi-skill',
      license: 'MIT',
      method: '借用五行与四柱的结构化思路，把行为偏好翻译成元素隐喻；不进行真实排盘。',
      observation: `你的主原型被翻译为「${primaryElement}」，竞争解释被翻译为「${secondaryElement}」。这不是命盘，只是一个提醒：你最常用的能量，可能也是你最不愿意调整的部分。`,
      question: '如果当前问题不是“我是什么命”，而是“我是不是把同一种元素用得过重”，你会先减掉什么？',
      practice: '把一个任务拆成“启动、推进、收束”三个动作，各用五分钟，不追求一次做完。',
    },
    {
      id: 'yinyuan',
      title: '月老',
      kicker: '关系镜像',
      sourceLabel: 'Ming-H/yinyuan-skills',
      sourceUrl: 'https://github.com/Ming-H/yinyuan-skills',
      license: '未声明许可证，仅作方法论参考',
      method: '把关系问题拆成期待、边界与回应节奏，避免把一次互动解释成命运。',
      observation: `${primary.relationship} 竞争解释「${secondary.name}」提醒你：你在关系里寻找的可能不是“对的人”，而是一种熟悉的回应节奏。`,
      question: '你在这段关系里最想被看见的需要是什么？它和“对方应该怎么做”是同一件事吗？',
      practice: '把“我希望对方懂我”改写成一个具体、可回应的请求。',
    },
    {
      id: 'buddhist',
      title: '佛学',
      kicker: '执着检查',
      sourceLabel: 'xr843/Master-skill',
      sourceUrl: 'https://github.com/xr843/Master-skill',
      license: 'NOASSERTION，仅作方法论参考',
      method: '以来源意识、边界意识和“不把解释当事实”为原则，做一次轻量的执着检查。',
      observation: `你的盲点“${primary.blindSpots[0]}”可以暂时被当作一个执着点来观察，而不是一个必须立刻修好的缺陷。`,
      question: '如果暂时放下“我必须证明自己是对的”，你会发现哪一个更真实的担心？',
      practice: '把今天的一次自我评价改写成“我注意到……”，不急着给它下结论。',
    },
    {
      id: 'fengshui',
      title: '风水',
      kicker: '环境摩擦',
      sourceLabel: 'voidforall/fengshui.skill',
      sourceUrl: 'https://github.com/voidforall/fengshui.skill',
      license: '未声明许可证，仅作方法论参考',
      method: '把“运势”翻译成环境摩擦：观察空间、动线与未完成任务如何消耗注意力。',
      observation: `你的工作场景提示：${primary.work} 这不是方位判断，而是一条环境线索：你的空间是否在持续提醒你未完成的事？`,
      question: '你每天最常经过的一个位置，正在支持你，还是在反复消耗你？',
      practice: '清理一个可视范围内的小摩擦点：桌面、通知、门口或床边的杂物。',
    },
    {
      id: 'tarot',
      title: '塔罗',
      kicker: '叙事抽牌',
      sourceLabel: 'daman-ovo-0404/tarot-skill',
      sourceUrl: 'https://github.com/daman-ovo-0404/tarot-skill',
      license: 'MIT',
      method: '使用大阿卡纳的象征语言做三牌叙事练习；牌面由本地种子确定，不构成预测。',
      observation: '把三张牌读成一个“起点、阻力、下一步”的故事，而不是一个关于未来的判决。',
      question: '如果这三张牌只是你此刻的三个隐喻，它们共同提醒你看见什么？',
      practice: '用一句话写下三牌故事，然后只选择一个今天能完成的小动作。',
      tarot,
    },
  ];
}
