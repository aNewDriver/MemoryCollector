/**
 * 第二章：遗忘之境 - 完整50关配置
 * 主题：遗忘与失去
 */

import { LevelConfig } from '../LevelData';

export const CHAPTER_2_FULL: LevelConfig[] = [
    // 第1-10关：遗忘边缘
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch2_stage_${i + 1}`,
        name: `遗忘之境 - 边缘${i + 1}`,
        chapter: 2,
        stageNumber: i + 1,
        description: '记忆开始模糊的地方',
        background: 'forgetting_edge',
        difficulty: 2 + Math.floor(i / 3),
        enemyIds: ['forgetting_wisp', 'lost_memory', 'fading_shadow'][i % 3],
        enemyLevel: 51 + i,
        rewards: { exp: 600 + i * 30, gold: 400 + i * 20, memoryShards: 25 + i * 2 }
    })),
    
    // 第11-20关：遗忘沼泽
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch2_stage_${i + 11}`,
        name: `遗忘之境 - 沼泽${i + 1}`,
        chapter: 2,
        stageNumber: i + 11,
        description: '深陷其中，记忆不断流失',
        background: 'swamp_of_forgetting',
        difficulty: 3 + Math.floor(i / 3),
        enemyIds: ['swamp_dweller', 'memory_leech', 'forgetting_horror'][i % 3],
        enemyLevel: 61 + i,
        isBossLevel: i === 9,
        rewards: { exp: 900 + i * 35, gold: 600 + i * 25, memoryShards: 45 + i * 3 }
    })),
    
    // 第21-30关：遗忘深渊
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch2_stage_${i + 21}`,
        name: `遗忘之境 - 深渊${i + 1}`,
        chapter: 2,
        stageNumber: i + 21,
        description: '深渊之中，连自我都快遗忘',
        background: 'abyss_of_forgetting',
        difficulty: 4 + Math.floor(i / 3),
        enemyIds: ['abyss_watcher', 'memory_devourer', 'self_forgetting'][i % 3],
        enemyLevel: 71 + i,
        isBossLevel: i === 9,
        rewards: { exp: 1200 + i * 40, gold: 900 + i * 30, memoryShards: 70 + i * 4 }
    })),
    
    // 第31-40关：遗忘核心
    ...Array.from({ length: 10 }, (_, i) => ({
        id: `ch2_stage_${i + 31}`,
        name: `遗忘之境 - 核心${i + 1}`,
        chapter: 2,
        stageNumber: i + 31,
        description: '遗忘力量的源头附近',
        background: 'core_of_forgetting',
        difficulty: 5 + Math.floor(i / 3),
        enemyIds: ['forgetting_avatar', 'memory_destroyer', 'void_touched'][i % 3],
        enemyLevel: 81 + i,
        isBossLevel: i === 9,
        rewards: { exp: 1600 + i * 50, gold: 1200 + i * 40, memoryShards: 100 + i * 5 }
    })),
    
    // 第41-49关：遗忘王座前
    ...Array.from({ length: 9 }, (_, i) => ({
        id: `ch2_stage_${i + 41}`,
        name: `遗忘之境 - 王座前${i + 1}`,
        chapter: 2,
        stageNumber: i + 41,
        description: '守护者所在之处',
        background: 'throne_approach_ch2',
        difficulty: 6,
        enemyIds: ['forgetting_elite', 'memory_nullifier'][i % 2],
        enemyLevel: 91 + i,
        rewards: { exp: 2100 + i * 60, gold: 1600 + i * 50, memoryShards: 140 + i * 6 }
    })),
    
    // 第50关：遗忘守护者
    {
        id: 'ch2_stage_50',
        name: '遗忘之境 - 守护者之战',
        chapter: 2,
        stageNumber: 50,
        description: '第二章最终Boss战 - 遗忘守护者',
        background: 'forgetting_throne',
        difficulty: 7,
        enemyIds: ['ch2_final_boss'],
        enemyLevel: 100,
        isBossLevel: true,
        isChapterBoss: true,
        rewards: {
            exp: 8000,
            gold: 5000,
            memoryShards: 300,
            cards: ['ch2_boss_card'],
            relics: ['relic_forgetting_crown']
        }
    }
];

export const CHAPTER_2_STATS = {
    totalStages: 50,
    difficultyRange: '2-7',
    enemyLevelRange: '51-100'
};
