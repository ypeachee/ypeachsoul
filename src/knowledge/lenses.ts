import { getArchetype } from '../domain/scoring';
import { ARCHETYPE_IDS, type ArchetypeId, type QuizResult } from '../domain/types';
import { drawMajorArcana, type TarotDraw } from './tarot';

export type LensId = 'qimen-ziwei' | 'bazi' | 'yinyuan' | 'buddhist' | 'fengshui' | 'tarot';


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
    method: '摘要层借用五行与四柱的结构化思路，把行为偏好翻译成元素隐喻；完整四柱排盘在八字实验页完成。',
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
    license: 'MIT，仅作方法论参考',
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
  const tarot = drawMajorArcana(`${seed}|tarot`);

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
      method: '摘要层借用五行与四柱的结构化思路，把行为偏好翻译成元素隐喻；完整四柱排盘在八字实验页完成。',
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
      license: 'MIT，仅作方法论参考',
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
