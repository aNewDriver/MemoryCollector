/**
 * 第十章：最终回收 - 完整50关配置
 * 主题：最终决战与结局
 */

import { LevelConfig } from '../LevelData';

export const CHAPTER_10_STAGES: LevelConfig[] = [
  // 第1-10关：记忆之源
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch10_stage_${i + 1}`,
    name: `记忆之源 - 区域${i + 1}`,
    chapter: 10,
    stageNumber: i + 1,
    description: '所有记忆的源头，世界的真相即将揭晓',
    background: 'memory_source',
    difficulty: Math.min(13, 10 + Math.floor(i / 3)),
    enemyIds: ['source_guardian', 'origin_protector', 'memory_keeper'][i % 3],
    enemyLevel: 451 + i * 2,
    rewards: { exp: 3000 + i * 100, gold: 1800 + i * 60, memoryShards: 150 + i * 10 }
  })),
  
  // 第11-20关：终极考验
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch10_stage_${i + 11}`,
    name: `终极考验 - ${i + 1}`,
    chapter: 10,
    stageNumber: i + 11,
    description: '最终试炼，所有选择都将得到验证',
    background: 'final_trial',
    difficulty: Math.min(14, 11 + Math.floor(i / 3)),
    enemyIds: ['trial_master', 'final_judge', 'destiny_arbiter', 'fate_executor'][i % 4],
    enemyLevel: 471 + i * 2,
    rewards: { exp: 4000 + i * 120, gold: 2500 + i * 80, memoryShards: 200 + i * 15 }
  })),
  
  // 第21-30关：命运交织
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch10_stage_${i + 21}`,
    name: `命运之网 - ${i + 1}`,
    chapter: 10,
    stageNumber: i + 21,
    description: '命运的丝线在此汇聚',
    background: 'fate_convergence',
    difficulty: Math.min(15, 12 + Math.floor(i / 3)),
    enemyIds: ['fate_master', 'destiny_lord', 'karma_collector'][i % 3],
    enemyLevel: 491 + i * 2,
    isBossLevel: i === 9,
    rewards: { exp: 5200 + i * 150, gold: 3300 + i * 100, memoryShards: 260 + i * 20 }
  })),
  
  // 第31-40关：真相浮现
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch10_stage_${i + 31}`,
    name: `真相殿堂 - ${i + 1}`,
    chapter: 10,
    stageNumber: i + 31,
    description: '所有谜团的答案即将揭晓',
    background: 'truth_palace',
    difficulty: Math.min(15, 13 + Math.floor(i / 3)),
    enemyIds: ['truth_avatar', 'reality_master', 'existence_guardian'][i % 3],
    enemyLevel: 511 + i * 2,
    isBossLevel: i === 9,
    rewards: { exp: 6600 + i * 180, gold: 4300 + i * 130, memoryShards: 340 + i * 25 }
  })),
  
  // 第41-49关：最终前哨
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `ch10_stage_${i + 41}`,
    name: `终焉之路 - ${i + 1}`,
    chapter: 10,
    stageNumber: i + 41,
    description: '通往最终Boss的最后道路',
    background: 'final_road',
    difficulty: 15,
    enemyIds: ['final_guardian', 'ultimate_protector', 'eternal_warden'][i % 3],
    enemyLevel: 531 + i * 2,
    rewards: { exp: 8200 + i * 200, gold: 5500 + i * 150, memoryShards: 440 + i * 30 }
  })),
  
  // 第50关：最终Boss战 - 记忆之主
  {
    id: 'ch10_stage_50',
    name: '记忆之主·最终决战',
    chapter: 10,
    stageNumber: 50,
    description: '最终Boss战 - 记忆之主的真面目终于揭晓',
    background: 'memory_throne_final',
    difficulty: 15,
    enemyIds: ['memory_master_final_boss'],
    enemyLevel: 550,
    isBossLevel: true,
    isChapterBoss: true,
    isFinalLevel: true,
    rewards: {
      exp: 25000,
      gold: 15000,
      memoryShards: 1000,
      cards: ['memory_overlord', 'eternal_recycler', 'truth_incarnate', 'memory_master_player'],
      relics: ['relic_memory_crown', 'relic_eternal_locket', 'relic_ultimate_truth']
    },
    specialRules: [
      '自我对决：Boss会复制玩家的所有属性和卡组',
      '记忆融合：每回合随机获得玩家已通关Boss的技能',
      '终极选择：战斗第10回合必须做出最终选择，影响结局'
    ],
    storySegments: [
      { trigger: 'start', dialogId: 'ch10_boss_intro' },
      { trigger: 'phase2', dialogId: 'ch10_truth_revealed' },
      { trigger: 'phase3', dialogId: 'ch10_final_choice' },
      { trigger: 'end', dialogId: 'ch10_game_clear' }
    ]
  }
];

export const CHAPTER_10_STATS = {
  totalStages: 50,
  normalStages: 44,
  miniBossStages: 5,
  chapterBoss: 1,
  finalBoss: 1,
  difficultyRange: '10-15',
  enemyLevelRange: '451-550'
};

// 第十章导出汇总
export const FINAL_CHAPTER_EXPORT = {
  chapter: 10,
  name: '最终回收',
  totalStages: CHAPTER_10_STAGES.length,
  stages: CHAPTER_10_STAGES,
  stats: CHAPTER_10_STATS
};
