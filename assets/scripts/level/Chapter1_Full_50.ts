/**
 * 第一章：记忆迷宫 - 完整50关配置
 * 主题：新手引导 + 基础教学
 */

import { LevelConfig } from '../LevelData';

export const CHAPTER_1_FULL: LevelConfig[] = [
    // 第1-10关：新手教学区
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch1_stage_${i + 1}`,
        name: `记忆迷宫 - 区域${i + 1}`,
        chapter: 1,
        stageNumber: i + 1,
        description: i < 3 ? '新手教学区域，学习基础操作' : 
                     i < 6 ? '初级战斗训练' : 
                     i < 9 ? '元素克制入门' : '区域Boss前哨战',
        background: 'memory_maze',
        difficulty: Math.floor(i / 3) + 1,
        enemyIds: i < 3 ? ['training_dummy'] : 
                  i < 6 ? ['shadow_minion', 'memory_fragment'] : 
                  i < 9 ? ['elemental_apprentice'] : ['area_guardian'],
        enemyLevel: 1 + i,
        isBossLevel: i === 9,
        rewards: {
            exp: 100 + i * 20,
            gold: 50 + i * 10,
            memoryShards: 5 + i,
            cards: i === 9 ? ['first_clear_reward'] : undefined
        },
        storySegments: i === 0 ? [{ trigger: 'start', dialogId: 'ch1_tutorial_start' }] :
                        i === 9 ? [{ trigger: 'end', dialogId: 'ch1_boss_defeated' }] : undefined
    })),
    
    // 第11-20关：初级探索区
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch1_stage_${i + 11}`,
        name: `记忆迷宫 - 探索${i + 1}`,
        chapter: 1,
        stageNumber: i + 11,
        description: '深入记忆迷宫，遭遇更多敌人',
        background: 'maze_depths',
        difficulty: 2 + Math.floor(i / 3),
        enemyIds: ['shadow_warrior', 'memory_eater', 'lost_soul', 'maze_guardian'][i % 4],
        enemyLevel: 11 + i,
        isBossLevel: i === 9,
        rewards: {
            exp: 300 + i * 25,
            gold: 150 + i * 15,
            memoryShards: 15 + i * 2
        }
    })),
    
    // 第21-30关：中级挑战区
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch1_stage_${i + 21}`,
        name: `记忆迷宫 - 挑战${i + 1}`,
        chapter: 1,
        stageNumber: i + 21,
        description: '迷宫深处，挑战升级',
        background: 'maze_core',
        difficulty: 3 + Math.floor(i / 3),
        enemyIds: ['elite_shadow', 'memory_devourer', 'soul_collector', 'maze_elite'][i % 4],
        enemyLevel: 21 + i,
        isBossLevel: i === 9,
        rewards: {
            exp: 500 + i * 30,
            gold: 300 + i * 20,
            memoryShards: 30 + i * 3
        }
    })),
    
    // 第31-40关：高级危险区
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch1_stage_${i + 31}`,
        name: `记忆迷宫 - 深渊${i + 1}`,
        chapter: 1,
        stageNumber: i + 31,
        description: '迷宫最深处，危险重重',
        background: 'maze_abyss',
        difficulty: 4 + Math.floor(i / 3),
        enemyIds: ['shadow_lord', 'memory_horror', 'soul_reaper', 'abyss_guardian'][i % 4],
        enemyLevel: 31 + i,
        isBossLevel: i === 9,
        rewards: {
            exp: 800 + i * 40,
            gold: 500 + i * 30,
            memoryShards: 50 + i * 4
        }
    })),
    
    // 第41-49关：精英挑战区
    ...Array.from({ length: 9 }, (_, i) => ({
        id: `ch1_stage_${i + 41}`,
        name: `记忆迷宫 - 极限${i + 1}`,
        chapter: 1,
        stageNumber: i + 41,
        description: '通往最终Boss的最后考验',
        background: 'maze_throne_approach',
        difficulty: 5,
        enemyIds: ['shadow_master', 'memory_tyrant', 'soul_overlord'][i % 3],
        enemyLevel: 41 + i,
        rewards: {
            exp: 1200 + i * 50,
            gold: 800 + i * 40,
            memoryShards: 80 + i * 5
        }
    })),
    
    // 第50关：章节Boss
    {
        id: 'ch1_stage_50',
        name: '记忆迷宫 - 守护者之战',
        chapter: 1,
        stageNumber: 50,
        description: '第一章最终Boss战 - 记忆迷宫守护者',
        background: 'maze_throne',
        difficulty: 6,
        enemyIds: ['ch1_final_boss'],
        enemyLevel: 50,
        isBossLevel: true,
        isChapterBoss: true,
        rewards: {
            exp: 5000,
            gold: 3000,
            memoryShards: 200,
            cards: ['ch1_boss_card'],
            relics: ['relic_maze_core']
        },
        storySegments: [
            { trigger: 'start', dialogId: 'ch1_boss_intro' },
            { trigger: 'phase2', dialogId: 'ch1_boss_phase2' },
            { trigger: 'end', dialogId: 'ch1_chapter_clear' }
        ]
    }
];

// 第一章关卡统计
export const CHAPTER_1_STATS = {
    totalStages: 50,
    normalStages: 44,
    miniBossStages: 5,  // 每10关一个小Boss
    chapterBoss: 1,
    difficultyRange: '1-6',
    enemyLevelRange: '1-50'
};
