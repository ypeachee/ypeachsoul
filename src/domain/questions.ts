import type { Question } from './types';

export const questions: readonly Question[] = [
  {
    id: 'q1',
    prompt: '突然多出一个没有安排的下午，你更想怎么过？',
    options: [
      { id: 'q1-a', label: '关掉消息，读点难的东西，把脑子沉下去', archetypeId: 'deep-diver' },
      { id: 'q1-b', label: '打开收藏夹，顺着一个念头往远处想', archetypeId: 'stargazer' },
      { id: 'q1-c', label: '整理最近的感受，写一段只给自己看的总结', archetypeId: 'alchemist' },
      { id: 'q1-d', label: '做点没有目的的小创作，看看会长出什么', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q2',
    prompt: '接到一个完全陌生的任务，你最先做什么？',
    options: [
      { id: 'q2-a', label: '先拆目标、资源和风险，搭一个可执行框架', archetypeId: 'architect' },
      { id: 'q2-b', label: '先做最小版本，用真实反馈修正方向', archetypeId: 'pathfinder' },
      { id: 'q2-c', label: '先问清谁需要什么，再安排协作节奏', archetypeId: 'fire-keeper' },
      { id: 'q2-d', label: '凭直觉挑最有生命力的切口，立刻开始', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q3',
    prompt: '计划突然被打乱时，你通常会怎样反应？',
    options: [
      { id: 'q3-a', label: '暂停外部声音，重新想清真正重要的变量', archetypeId: 'deep-diver' },
      { id: 'q3-b', label: '列出几种新可能，观察哪条路最有拉力', archetypeId: 'stargazer' },
      { id: 'q3-c', label: '把这次变化当作线索，找背后的重复模式', archetypeId: 'alchemist' },
      { id: 'q3-d', label: '顺势改写计划，把意外变成新的叙事', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q4',
    prompt: '重要决定信息不完整，你会怎样推进？',
    options: [
      { id: 'q4-a', label: '明确假设，列出最坏情况，再做可控决策', archetypeId: 'architect' },
      { id: 'q4-b', label: '先小步试错，用行动换取新信息', archetypeId: 'pathfinder' },
      { id: 'q4-c', label: '先问相关的人怎么想，避免一个人做决定', archetypeId: 'fire-keeper' },
      { id: 'q4-d', label: '先选一个此刻最有感觉的方向，边走边修正', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q5',
    prompt: '旅行途中路线临时改变，你更愿意怎么处理这个意外？',
    options: [
      { id: 'q5-a', label: '找一间安静的店坐下，观察城市真实的一面', archetypeId: 'deep-diver' },
      { id: 'q5-b', label: '打开地图找没计划过的地点，留下随机路线', archetypeId: 'stargazer' },
      { id: 'q5-c', label: '记录当下情绪，看看这次变化触动了什么', archetypeId: 'alchemist' },
      { id: 'q5-d', label: '把临时改路当成故事的一部分，拍下意外的画面', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q6',
    prompt: '和重要的人发生冲突，你最想先做哪一步？',
    options: [
      { id: 'q6-a', label: '把事实、需求和边界写清，推动一次结构化对话', archetypeId: 'architect' },
      { id: 'q6-b', label: '先做一个低风险尝试，看关系能否靠行动松动', archetypeId: 'pathfinder' },
      { id: 'q6-c', label: '先接住对方情绪，再说明自己的真实感受', archetypeId: 'fire-keeper' },
      { id: 'q6-d', label: '直接说出立场，接受关系可能因此重新排列', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q7',
    prompt: '准备学一项新技能，你最自然的入口是什么？',
    options: [
      { id: 'q7-a', label: '系统读完核心材料，建立自己的知识地图', archetypeId: 'deep-diver' },
      { id: 'q7-b', label: '同时试几个方向，让兴趣带你找到入口', archetypeId: 'stargazer' },
      { id: 'q7-c', label: '把练习和真实感受结合，提炼成自己的方法', archetypeId: 'alchemist' },
      { id: 'q7-d', label: '先做一个有趣的小作品，用创造带动学习', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q8',
    prompt: '低能量的一天，你会怎样让自己重新运转？',
    options: [
      { id: 'q8-a', label: '删掉非必要事项，只保留最小可运行日程', archetypeId: 'architect' },
      { id: 'q8-b', label: '出门走一小段，用环境变化换一点能量', archetypeId: 'pathfinder' },
      { id: 'q8-c', label: '找信任的人待一会儿，让自己被照顾一下', archetypeId: 'fire-keeper' },
      { id: 'q8-d', label: '允许自己彻底停一下，等生命力重新回来', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q9',
    prompt: '别人带着一个难题来找你，你更可能怎样帮他？',
    options: [
      { id: 'q9-a', label: '先问清问题结构，再给一个可验证的分析', archetypeId: 'deep-diver' },
      { id: 'q9-b', label: '帮他打开更多可能性，不急着下结论', archetypeId: 'stargazer' },
      { id: 'q9-c', label: '先理解这件事对他意味着什么', archetypeId: 'alchemist' },
      { id: 'q9-d', label: '用比喻或故事帮他把处境重新讲一遍', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q10',
    prompt: '一群人要共同完成一件没有先例的事，你最自然的位置是？',
    options: [
      { id: 'q10-a', label: '设定目标、分工和验收标准', archetypeId: 'architect' },
      { id: 'q10-b', label: '先推动一个小实验，让团队动起来', archetypeId: 'pathfinder' },
      { id: 'q10-c', label: '关注气氛，确保每个人都被看见', archetypeId: 'fire-keeper' },
      { id: 'q10-d', label: '提出一个大胆方向，打破僵局', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q11',
    prompt: '重读一本旧书或重看一部旧电影，你最先被什么吸引？',
    options: [
      { id: 'q11-a', label: '上次没注意到的论证、伏笔和细节', archetypeId: 'deep-diver' },
      { id: 'q11-b', label: '顺着一个细节去查更多相关的作品', archetypeId: 'stargazer' },
      { id: 'q11-c', label: '它为什么在今天忽然击中了自己', archetypeId: 'alchemist' },
      { id: 'q11-d', label: '如果重写结局，故事会变成什么样', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q12',
    prompt: '截止日期突然提前，你会先做什么？',
    options: [
      { id: 'q12-a', label: '重排优先级和风险，更新可执行计划', archetypeId: 'architect' },
      { id: 'q12-b', label: '先交付一个可运行版本，再补细节', archetypeId: 'pathfinder' },
      { id: 'q12-c', label: '先同步相关人员，稳定团队情绪', archetypeId: 'fire-keeper' },
      { id: 'q12-d', label: '砍掉不必要的部分，直接抓核心', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q13',
    prompt: '一个人走很长的路，你的脑子通常会做什么？',
    options: [
      { id: 'q13-a', label: '让注意力沉下来，把一个问题想透', archetypeId: 'deep-diver' },
      { id: 'q13-b', label: '观察周围，任由念头跳到很远的地方', archetypeId: 'stargazer' },
      { id: 'q13-c', label: '回想最近的情绪，看它们想说什么', archetypeId: 'alchemist' },
      { id: 'q13-d', label: '给路过的场景编一个故事', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q14',
    prompt: '准备搬到一个陌生城市，你最想先确认什么？',
    options: [
      { id: 'q14-a', label: '区域、预算、通勤和长期生活成本', archetypeId: 'architect' },
      { id: 'q14-b', label: '先短住几天，用真实体验做决定', archetypeId: 'pathfinder' },
      { id: 'q14-c', label: '朋友、社群和可以依靠的人在哪里', archetypeId: 'fire-keeper' },
      { id: 'q14-d', label: '先搬过去，让新环境推着自己改变', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q15',
    prompt: '一个相同的问题反复出现，你会怎么处理？',
    options: [
      { id: 'q15-a', label: '拆开事实、假设和真正的约束', archetypeId: 'deep-diver' },
      { id: 'q15-b', label: '寻找另一种完全不同的解释框架', archetypeId: 'stargazer' },
      { id: 'q15-c', label: '追问它为什么总在相似时刻出现', archetypeId: 'alchemist' },
      { id: 'q15-d', label: '把它写成一个能被重新理解的故事', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q16',
    prompt: '有人临时开口请你帮忙，你更可能怎么回应？',
    options: [
      { id: 'q16-a', label: '先确认范围、时间和边界', archetypeId: 'architect' },
      { id: 'q16-b', label: '先帮一个小忙，再看后续怎么发展', archetypeId: 'pathfinder' },
      { id: 'q16-c', label: '能帮就帮，先照顾对方的需要', archetypeId: 'fire-keeper' },
      { id: 'q16-d', label: '直接说明自己愿不愿意，不绕弯', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q17',
    prompt: '如果做一个只属于自己的项目，你最先想做什么？',
    options: [
      { id: 'q17-a', label: '把核心问题研究透，建立自己的框架', archetypeId: 'deep-diver' },
      { id: 'q17-b', label: '列出很多可能性，挑最让你兴奋的', archetypeId: 'stargazer' },
      { id: 'q17-c', label: '先确认它和你的真实经历有什么关系', archetypeId: 'alchemist' },
      { id: 'q17-d', label: '先做出一个有审美和情绪的雏形', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q18',
    prompt: '团队里有人明显跟不上节奏，你更可能怎么处理？',
    options: [
      { id: 'q18-a', label: '明确标准、差距和改进计划', archetypeId: 'architect' },
      { id: 'q18-b', label: '一起做一次小任务，现场找卡点', archetypeId: 'pathfinder' },
      { id: 'q18-c', label: '先了解对方状态，再给支持', archetypeId: 'fire-keeper' },
      { id: 'q18-d', label: '直接指出问题，让责任回到对方', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q19',
    prompt: '回想一次重要转变，你更常记住什么？',
    options: [
      { id: 'q19-a', label: '当时的条件、关键决策和后果', archetypeId: 'deep-diver' },
      { id: 'q19-b', label: '如果当时选了另一条路会怎样', archetypeId: 'stargazer' },
      { id: 'q19-c', label: '这段经历最终改变了我什么', archetypeId: 'alchemist' },
      { id: 'q19-d', label: '当时的画面、声音和情绪', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q20',
    prompt: '计划一次旅行，你最享受哪个阶段？',
    options: [
      { id: 'q20-a', label: '做详细路线、预算和备选方案', archetypeId: 'architect' },
      { id: 'q20-b', label: '只订大交通，其他到现场再决定', archetypeId: 'pathfinder' },
      { id: 'q20-c', label: '先问同行的人想怎么玩，照顾每个人', archetypeId: 'fire-keeper' },
      { id: 'q20-d', label: '选一个方向就走，保留最大自由', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q21',
    prompt: '进入一个信息很密的展览，你会怎么逛？',
    options: [
      { id: 'q21-a', label: '按自己的节奏细看少数作品', archetypeId: 'deep-diver' },
      { id: 'q21-b', label: '先扫一遍，找最想深入的方向', archetypeId: 'stargazer' },
      { id: 'q21-c', label: '寻找作品和近期状态之间的对应', archetypeId: 'alchemist' },
      { id: 'q21-d', label: '让展览在脑中变成一条叙事线', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q22',
    prompt: '面对一笔较大的消费，你更倾向怎样决定？',
    options: [
      { id: 'q22-a', label: '比较参数、风险和长期成本', archetypeId: 'architect' },
      { id: 'q22-b', label: '先租、借或试用，再决定是否购买', archetypeId: 'pathfinder' },
      { id: 'q22-c', label: '问问家人或信任的人怎么想', archetypeId: 'fire-keeper' },
      { id: 'q22-d', label: '选真正让你心动的那一个', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q23',
    prompt: '深夜突然想到一个点子，你会怎么处理？',
    options: [
      { id: 'q23-a', label: '先验证它是否有逻辑漏洞', archetypeId: 'deep-diver' },
      { id: 'q23-b', label: '顺着它继续推演更多可能', archetypeId: 'stargazer' },
      { id: 'q23-c', label: '记录它为什么此刻出现', archetypeId: 'alchemist' },
      { id: 'q23-d', label: '立刻写下画面或一句开场', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q24',
    prompt: '一个不错但不确定的新机会出现，你会怎么评估？',
    options: [
      { id: 'q24-a', label: '分析成长、资源和风险', archetypeId: 'architect' },
      { id: 'q24-b', label: '先接一个小项目试水', archetypeId: 'pathfinder' },
      { id: 'q24-c', label: '看团队和关系是否值得投入', archetypeId: 'fire-keeper' },
      { id: 'q24-d', label: '如果它让你有生命力，就先跳进去', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q25',
    prompt: '一次完全独处的时间，你最想怎样使用？',
    options: [
      { id: 'q25-a', label: '阅读、思考，把注意力收回来', archetypeId: 'deep-diver' },
      { id: 'q25-b', label: '让好奇心带你去一个陌生主题', archetypeId: 'stargazer' },
      { id: 'q25-c', label: '整理情绪和最近的关系', archetypeId: 'alchemist' },
      { id: 'q25-d', label: '做一件没有观众的小作品', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q26',
    prompt: '朋友之间出现微妙紧张，你更可能做什么？',
    options: [
      { id: 'q26-a', label: '把问题摊开，建立更清晰的规则', archetypeId: 'architect' },
      { id: 'q26-b', label: '创造一次新的共同经历，松动关系', archetypeId: 'pathfinder' },
      { id: 'q26-c', label: '私下照顾受影响的每个人', archetypeId: 'fire-keeper' },
      { id: 'q26-d', label: '直接说出真实感受，允许关系重组', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q27',
    prompt: '面对一个模糊的创作任务，你会从哪里开始？',
    options: [
      { id: 'q27-a', label: '先研究约束和参考，找到核心问题', archetypeId: 'deep-diver' },
      { id: 'q27-b', label: '发散出多个方向，再观察哪个有生命力', archetypeId: 'stargazer' },
      { id: 'q27-c', label: '先确认它和你的真实经验有什么关系', archetypeId: 'alchemist' },
      { id: 'q27-d', label: '先做出一个有趣的原型', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q28',
    prompt: '开始一个副业或长期个人项目，你最需要什么？',
    options: [
      { id: 'q28-a', label: '清晰的范围、里程碑和停止条件', archetypeId: 'architect' },
      { id: 'q28-b', label: '尽快发布一个粗糙版本，收集反馈', archetypeId: 'pathfinder' },
      { id: 'q28-c', label: '找到伙伴，让过程有连接', archetypeId: 'fire-keeper' },
      { id: 'q28-d', label: '先做最有趣的部分，保持动力', archetypeId: 'wind-chaser' },
    ],
  },
  {
    id: 'q29',
    prompt: '一个长期项目结束时，你最想留下什么？',
    options: [
      { id: 'q29-a', label: '复盘结构、决策和可复用经验', archetypeId: 'deep-diver' },
      { id: 'q29-b', label: '想它还能延伸到哪些新方向', archetypeId: 'stargazer' },
      { id: 'q29-c', label: '整理这段经历带来的内在变化', archetypeId: 'alchemist' },
      { id: 'q29-d', label: '给它写一个结尾，保存成作品', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q30',
    prompt: '一个重大决定必须在明天前做出，你会怎样收束？',
    options: [
      { id: 'q30-a', label: '用决策矩阵和风险清单收束', archetypeId: 'architect' },
      { id: 'q30-b', label: '选最可逆的一步，先行动', archetypeId: 'pathfinder' },
      { id: 'q30-c', label: '先确认它会不会伤害重要关系', archetypeId: 'fire-keeper' },
      { id: 'q30-d', label: '听直觉，选那个让你更像自己的选项', archetypeId: 'wind-chaser' },
    ],
  },
];
