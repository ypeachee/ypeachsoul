import { getArchetype } from '../domain/scoring';
import type { ArchetypeId, QuizResult } from '../domain/types';

export type JungianFunctionId = 'Ni' | 'Ne' | 'Ti' | 'Te' | 'Fi' | 'Fe' | 'Si' | 'Se';

interface FunctionDefinition {
  id: JungianFunctionId;
  name: string;
  group: '直觉' | '思考' | '情感' | '感觉';
  attitude: '内倾' | '外倾';
  short: string;
  archetypeId: ArchetypeId;
}

export interface JungianFunctionScore extends FunctionDefinition {
  score: number;
  percentage: number;
  rank: number;
  archetypeName: string;
}

export interface CareerDirection {
  title: string;
  roles: readonly string[];
  why: string;
}

export interface WorkplacePositioning {
  title: string;
  summary: string;
  teamValue: string;
  fitEnvironment: string;
  watchout: string;
}

export interface JungianCareerProfile {
  functions: JungianFunctionScore[];
  primary: JungianFunctionScore;
  auxiliary: JungianFunctionScore;
  blind: JungianFunctionScore;
  careerDirections: readonly CareerDirection[];
  positioning: WorkplacePositioning;
  experiment: string;
  boundary: string;
}

export const JUNGIAN_FUNCTIONS: readonly FunctionDefinition[] = [
  { id: 'Ni', name: '内倾直觉', group: '直觉', attitude: '内倾', short: '把分散线索收束成长期方向', archetypeId: 'stargazer' },
  { id: 'Ne', name: '外倾直觉', group: '直觉', attitude: '外倾', short: '从可能性中生成新的连接', archetypeId: 'dream-weaver' },
  { id: 'Ti', name: '内倾思考', group: '思考', attitude: '内倾', short: '建立内部一致的结构与原则', archetypeId: 'architect' },
  { id: 'Te', name: '外倾思考', group: '思考', attitude: '外倾', short: '把目标转成可执行系统', archetypeId: 'pathfinder' },
  { id: 'Fi', name: '内倾情感', group: '情感', attitude: '内倾', short: '依据内在价值判断什么重要', archetypeId: 'alchemist' },
  { id: 'Fe', name: '外倾情感', group: '情感', attitude: '外倾', short: '读取并调节关系中的温度', archetypeId: 'fire-keeper' },
  { id: 'Si', name: '内倾感觉', group: '感觉', attitude: '内倾', short: '从经验与细节中确认稳定感', archetypeId: 'deep-diver' },
  { id: 'Se', name: '外倾感觉', group: '感觉', attitude: '外倾', short: '在当下快速感知并行动', archetypeId: 'wind-chaser' },
];

const CAREER_DATA: Record<JungianFunctionId, {
  positioning: WorkplacePositioning;
  directions: readonly CareerDirection[];
  experiment: string;
}> = {
  Ni: {
    positioning: {
      title: '长期方向侦察员',
      summary: '你更容易从大量碎片里看见一个尚未被说清的长期方向。适合做需要判断趋势、定义问题和整合信息的工作。',
      teamValue: '把杂音收束成方向，帮助团队判断什么值得长期投入。',
      fitEnvironment: '复杂、开放、允许深度思考，且不要求你每天即时给出大量反应。',
      watchout: '容易在脑内推演太久，却没有把依据、假设和下一步同步给团队。',
    },
    directions: [
      { title: '战略与洞察', roles: ['战略研究', '市场洞察', '产品规划', '用户研究'], why: '需要把弱信号整合成可验证的判断，而不是只做信息搬运。' },
      { title: '内容与叙事', roles: ['品牌策略', '趋势研究', '内容主理', '创意策划'], why: '能把复杂变化翻译成一个别人愿意理解和跟随的故事。' },
      { title: '产品与创新', roles: ['产品经理', '创新顾问', '体验策略', '服务设计'], why: '适合从长期用户问题和系统变化出发，定义下一代产品方向。' },
    ],
    experiment: '本周写一页趋势判断，只保留一个核心结论、三个证据和两个反例。',
  },
  Ne: {
    positioning: {
      title: '可能性探索者',
      summary: '你擅长把不相关的事物连成新方向，在信息不完整时也能生成足够多的选项。适合探索、创意和从零到一的工作。',
      teamValue: '打开团队没有想到的路径，让问题从单选题变成多选题。',
      fitEnvironment: '变化快、允许试错、能持续接触新用户和新场景。',
      watchout: '容易同时点亮太多方向，导致每个方向都停在概念阶段。',
    },
    directions: [
      { title: '创意与内容', roles: ['创意策划', '内容运营', '品牌文案', '社媒策划'], why: '需要持续生成新连接，并对受众反馈快速调整。' },
      { title: '创新产品', roles: ['产品探索', '增长实验', '创新顾问', '服务设计'], why: '适合用低成本原型快速验证多个可能方向。' },
      { title: '跨领域研究', roles: ['趋势研究', '用户研究', '社区运营', '知识产品'], why: '能把不同领域的信息重新组合成新的问题入口。' },
    ],
    experiment: '给三个正在发散的点子各设一个成本最低的验证动作，只保留一个进入下一周。',
  },
  Ti: {
    positioning: {
      title: '复杂系统拆解者',
      summary: '你倾向于先建立内部一致的解释模型，再采取行动。适合需要逻辑、结构、深度分析和清晰判断的工作。',
      teamValue: '把混乱问题拆成可理解的结构，并指出方案里的隐藏漏洞。',
      fitEnvironment: '问题足够复杂、有自主思考空间、评价标准清晰且不靠频繁打断推进。',
      watchout: '容易把模型做得比任务需要的更完整，也要留意别人不一定共享你的推理前提。',
    },
    directions: [
      { title: '系统与技术', roles: ['软件工程师', '系统架构', '数据工程师', '技术产品经理'], why: '需要持续理解结构、约束和系统之间的因果关系。' },
      { title: '分析与流程', roles: ['数据分析', '商业分析', '流程设计', '策略分析'], why: '适合把模糊业务问题转成可检验的模型和指标。' },
      { title: '复杂问题咨询', roles: ['技术顾问', '解决方案架构', '研究分析', '模型设计'], why: '能在多方信息冲突时建立一套更清晰的判断框架。' },
    ],
    experiment: '画一张当前项目的系统图，标出三个关键依赖，再请一位同事指出你没看到的风险。',
  },
  Te: {
    positioning: {
      title: '目标推进器',
      summary: '你更习惯把目标转成里程碑、责任和可交付结果。适合节奏明确、需要推动多人协作并快速闭环的工作。',
      teamValue: '把讨论变成计划，把计划变成交付，让团队知道现在最重要的一步是什么。',
      fitEnvironment: '结果清晰、决策链较短、反馈直接，并且你有足够的推进权限。',
      watchout: '推进速度可能压过他人的理解节奏，也容易把不属于自己的结果一起接过来。',
    },
    directions: [
      { title: '项目与运营', roles: ['项目经理', '运营经理', 'PMO', '交付经理'], why: '需要持续协调资源、处理依赖并让结果按时发生。' },
      { title: '增长与业务', roles: ['增长运营', '商务拓展', '业务负责人', '销售管理'], why: '适合用明确指标和快速反馈推动业务前进。' },
      { title: '组织推进', roles: ['产品运营', '供应链协调', '活动统筹', '流程负责人'], why: '能把跨团队协作变成一套可追踪的运行机制。' },
    ],
    experiment: '把一个目标拆成三个里程碑，只保留最关键的一个，并在今天推进到可见结果。',
  },
  Fi: {
    positioning: {
      title: '价值翻译者',
      summary: '你会先判断一件事是否符合内在价值，再决定投入程度。适合需要真实表达、理解人和守住质量边界的岗位。',
      teamValue: '识别用户和团队真正关心什么，避免产品在效率中失去意义。',
      fitEnvironment: '价值观一致、允许多一点反思、对表达质量有要求。',
      watchout: '容易把强烈感受直接当成事实，也可能替别人的情绪承担过多责任。',
    },
    directions: [
      { title: '内容与叙事', roles: ['品牌文案', '内容策划', '编辑', '独立创作者'], why: '需要把真实体验和价值判断转成有辨识度的表达。' },
      { title: '人与成长', roles: ['用户研究', '职业咨询', '教育设计', '社群运营'], why: '适合理解个体差异，并帮助人找到更真实的行动方向。' },
      { title: '体验与价值', roles: ['产品体验', '服务设计', '公益项目', '文化项目'], why: '能在效率之外守住体验、伦理和长期价值。' },
    ],
    experiment: '把最近一次强烈感受写成三栏：事实、我的解释、我真正想提出的请求。',
  },
  Fe: {
    positioning: {
      title: '团队黏合剂',
      summary: '你对关系温度和协作氛围很敏感，擅长让不同角色愿意继续合作。适合需要客户、团队和组织沟通的岗位。',
      teamValue: '发现被忽略的人与需求，维持团队在压力下的连接和承诺。',
      fitEnvironment: '高频协作、反馈及时、贡献能被看见，而不是被默认应该承担。',
      watchout: '为了维持和谐可能延迟冲突，也容易把别人的情绪当成自己的工作任务。',
    },
    directions: [
      { title: '客户与关系', roles: ['客户成功', '客户经理', '社群运营', '合作经理'], why: '需要持续理解关系变化，并把期待转成可执行的协作。' },
      { title: '人才与组织', roles: ['HRBP', '组织发展', '培训', '招聘'], why: '适合观察团队互动、帮助人找到位置并建立信任。' },
      { title: '协作与运营', roles: ['项目协调', '运营支持', '活动策划', '教育服务'], why: '能让多方协作保持温度，同时把承诺落到日常。' },
    ],
    experiment: '把一次“我希望对方懂我”改写成具体请求，并在今天说出口。',
  },
  Si: {
    positioning: {
      title: '稳定质量守门人',
      summary: '你会从经验、细节和既有标准里判断什么值得信任。适合需要耐心、准确性和长期维护的工作。',
      teamValue: '发现容易被忽略的细节风险，让团队的经验和方法能够被保留下来。',
      fitEnvironment: '节奏可预期、标准明确、允许持续打磨，而不是每天推翻全部规则。',
      watchout: '可能过度依赖过去的有效经验，在新的环境变化面前反应偏慢。',
    },
    directions: [
      { title: '研究分析', roles: ['研究助理', '数据分析', '用户研究', '档案管理'], why: '需要耐心核对信息，并从细节里建立可靠结论。' },
      { title: '质量与治理', roles: ['质量保证', '合规', '编辑审校', '测试'], why: '适合守住一致性、准确性和长期质量标准。' },
      { title: '知识与流程', roles: ['知识管理', '内容运营', 'SOP 设计', '后台运营'], why: '能把经验沉淀成别人可以重复使用的方法。' },
    ],
    experiment: '记录一个反复出现的工作流程，删掉一个多余步骤，并写成可复用说明。',
  },
  Se: {
    positioning: {
      title: '现场破局者',
      summary: '你对当下变化和真实反馈非常敏感，擅长在现场快速判断并推动行动。适合节奏快、需要直接接触人和场景的工作。',
      teamValue: '快速感知机会和阻力，在信息不完整时先做出可观察的行动。',
      fitEnvironment: '动态、直接、反馈明显，允许你根据现场变化调整方案。',
      watchout: '兴致退去时容易放下承诺，也可能在行动太快时忽略他人的节奏。',
    },
    directions: [
      { title: '一线增长', roles: ['销售', '商务拓展', '客户经理', '渠道运营'], why: '需要在真实互动中快速判断机会和阻力。' },
      { title: '现场与活动', roles: ['活动策划', '现场运营', '会展', '内容制作'], why: '适合在动态环境里即时协调、处理变化并推动结果发生。' },
      { title: '快速响应岗位', roles: ['运营值班', '危机响应', '采购', '项目执行'], why: '需要在短反馈周期里持续做判断和行动。' },
    ],
    experiment: '在 24 小时内完成一个能被别人看到的小动作，并记录一条真实反馈。',
  },
};

export function buildJungianCareerProfile(result: QuizResult): JungianCareerProfile {
  const total = Math.max(Object.values(result.scores).reduce((sum, score) => sum + score, 0), 1);
  const ranked = JUNGIAN_FUNCTIONS.map((definition) => ({
    ...definition,
    score: result.scores[definition.archetypeId],
    percentage: (result.scores[definition.archetypeId] / total) * 100,
    archetypeName: getArchetype(definition.archetypeId).name,
  })).sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return JUNGIAN_FUNCTIONS.findIndex((item) => item.id === left.id) - JUNGIAN_FUNCTIONS.findIndex((item) => item.id === right.id);
  });
  const withRanks: JungianFunctionScore[] = ranked.map((item, index) => ({ ...item, rank: index + 1 }));
  const primary = withRanks[0];
  const auxiliary = withRanks[1];
  const blind = withRanks[withRanks.length - 1];
  const career = CAREER_DATA[primary.id];

  return {
    functions: withRanks.slice().sort((left, right) => JUNGIAN_FUNCTIONS.findIndex((item) => item.id === left.id) - JUNGIAN_FUNCTIONS.findIndex((item) => item.id === right.id)),
    primary,
    auxiliary,
    blind,
    careerDirections: career.directions,
    positioning: {
      ...career.positioning,
      summary: `${career.positioning.summary} 辅助功能「${auxiliary.name}」会补充另一条处理路径。`,
    },
    experiment: career.experiment,
    boundary: '荣格八维与职业方向是基于当前 30 个选择的文化解释，不是正式 MBTI、职业测评、能力判断或录用建议。',
  };
}

