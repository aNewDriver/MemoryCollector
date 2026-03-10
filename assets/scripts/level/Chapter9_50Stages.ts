/**
 * 第九章：真相浮现 - 完整50关配置
 * 主题：真相与谎言的交织
 */

import { LevelConfig } from '../LevelData';

export const CHAPTER_9_STAGES: LevelConfig[] = [
  // 第1-10关：真相迷宫入门
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch9_stage_${i + 1}`,
    name: `真相迷宫 - 入口${i + 1}`,
    chapter: 9,
    stageNumber: i + 1,
    description: '真相的入口，谎言与真实难以分辨',
    background: 'truth_maze',
    difficulty: Math.min(9, 7 + Math.floor(i / 3)),
    enemyIds: ['truth_guardian', 'lie_spreader', 'reality_checker'][i % 3],
    enemyLevel: 351 + i * 2,
    rewards: { exp: 2500 + i * 80, gold: 1500 + i * 50, memoryShards: 120 + i * 8 }
  })),
  
  // 第11-20关：真相探索
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch9_stage_${i + 11}`,
    name: `真相回廊 - ${i + 1}`,
    chapter: 9,
    stageNumber: i + 11,
    description: '深入真相的迷宫',
    background: 'truth_corridor',
    difficulty: Math.min(10, 8 + Math.floor(i / 3)),
    enemyIds: ['truth_seeker', 'secret_keeper', 'mystery_solver', 'reality_warper'][i % 4],
    enemyLevel: 371 + i * 2,
    rewards: { exp: 3300 + i * 90, gold: 2000 + i * 60, memoryShards: 160 + i * 10 }
  })),
  
  // 第21-30关：真相核心
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch9_stage_${i + 21}`,
    name: `真相核心 - ${i + 1}`,
    chapter: 9,
    stageNumber: i + 21,
    description: '接近真相的核心区域',
    background: 'truth_core',
    difficulty: Math.min(11, 9 + Math.floor(i / 3)),
    enemyIds: ['truth_master', 'secret_lord', 'mystery_master'][i % 3],
    enemyLevel: 391 + i * 2,
    isBossLevel: i === 9,
    rewards: { exp: 4200 + i * 100, gold: 2600 + i * 70, memoryShards: 210 + i * 12 }
  })),
  
  // 第31-40关：真相深渊
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `ch9_stage_${i + 31}`,
    name: `真相深渊 - ${i + 1}`,
    chapter: 9,
    stageNumber: i + 31,
    description: '真相的黑暗面',
    background: 'truth_abyss',
    difficulty: Math.min(12, 10 + Math.floor(i / 3)),
    enemyIds: ['dark_truth', 'hidden_secret', 'ultimate_mystery'][i % 3],
    enemyLevel: 411 + i * 2,
    isBossLevel: i === 9,
    rewards: { exp: 5200 + i * 120, gold: 3300 + i * 80, memoryShards: 270 + i * 15 }
  })),
  
  // 第41-49关：终极真相前哨
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `ch9_stage_${i + 41}`,
    name: `真相尽头 - ${i + 1}`,
    chapter: 9,
    stageNumber: i + 41,
    description: '通往终极真相的道路',
    background: 'truth_end',
    difficulty: 12,
    enemyIds: ['truth_overlord', 'secret_emperor', 'mystery_supreme'][i % 3],
    enemyLevel: 431 + i * 2,
    rewards: { exp: 6400 + i * 150, gold: 4100 + i * 100, memoryShards: 340 + i * 20 }
  })),
  
  // 第50关：真相守护者Boss战
  {
    id: 'ch9_stage_50',
    name: '真相守护者之战',
    chapter: 9,
    stageNumber: 50,
    description: '第九章Boss战 - 真相的代价是沉重的',
    background: 'truth_throne',
    difficulty: 13,
    enemyIds: ['truth_guardian_boss'],
    enemyLevel: 450,
    isBossLevel: true,
    isChapterBoss: true,
    rewards: {
      exp: 12000,
      gold: 8000,
      memoryShards: 600,
      cards: ['truth_incarnate', 'ultimate_truth'],
      relics: ['relic_truth_crystal']
    },
    storySegments: [
      { trigger: 'start', dialogId: 'ch9_boss_intro' },
      { trigger: 'phase2', dialogId: 'ch9_truth_revealed' },
      { trigger: 'end', dialogId: 'ch9_chapter_clear' }
    ]
  }
];

export const CHAPTER_9_STATS = {
  totalStages: 50,
  normalStages: 44,
  miniBossStages: 5,
  chapterBoss: 1,
  difficultyRange: '8-13',
  enemyLevelRange: '351-450'
};
