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
      { id: 'q9-b', label: '提供几种可能路径，让对方自己选择', archetypeId: 'stargazer' },
      { id: 'q9-c', label: '先理解对方的感受，再帮忙看见模式', archetypeId: 'alchemist' },
      { id: 'q9-d', label: '帮对方把困境重新讲成一个有出口的故事', archetypeId: 'dream-weaver' },
    ],
  },
  {
    id: 'q10',
    prompt: '一年后回看现在，你最希望自己留下了什么？',
    options: [
      { id: 'q10-a', label: '留下一个真正跑起来的系统和可复用的方法', archetypeId: 'architect' },
      { id: 'q10-b', label: '走过几条没人走过的路，知道自己能到哪里', archetypeId: 'pathfinder' },
      { id: 'q10-c', label: '守住重要的人和事，让关系比一年前更深', archetypeId: 'fire-keeper' },
      { id: 'q10-d', label: '做过几次忠于自己的选择，没有被安全困住', archetypeId: 'wind-chaser' },
    ],
  },
];