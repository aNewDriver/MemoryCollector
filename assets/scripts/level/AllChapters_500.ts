/**
 * 完整关卡配置汇总
 * 10章 × 50关 = 500关
 */

import { CHAPTER_1_FULL, CHAPTER_1_STATS } from './Chapter1_Full_50';
import { CHAPTER_2_FULL, CHAPTER_2_STATS } from './Chapter2_Full_50';
import { CHAPTER_3_FULL, CHAPTER_3_STATS } from './Chapter3_Full_50';
import { CHAPTER_4_FULL, CHAPTER_4_STATS } from './Chapter4_Full_50';
import { CHAPTER_5_FULL, CHAPTER_5_STATS } from './Chapter5_Full_50';
import { CHAPTER_6_FULL, CHAPTER_6_STATS } from './Chapter6_Full_50';
import { CHAPTER_7_FULL, CHAPTER_7_STATS } from './Chapter7_Full_50';
import { CHAPTER_8_FULL, CHAPTER_8_STATS } from './Chapter8_Full_50';
import { CHAPTER_9_FULL, CHAPTER_9_STATS } from './Chapter9_Full_50';
import { CHAPTER_10_FULL, CHAPTER_10_STATS } from './Chapter10_Full_50';

// 所有关卡配置
export const ALL_LEVELS_CONFIG = [
    ...CHAPTER_1_FULL,
    ...CHAPTER_2_FULL,
    ...CHAPTER_3_FULL,
    ...CHAPTER_4_FULL,
    ...CHAPTER_5_FULL,
    ...CHAPTER_6_FULL,
    ...CHAPTER_7_FULL,
    ...CHAPTER_8_FULL,
    ...CHAPTER_9_FULL,
    ...CHAPTER_10_FULL
];

// 章节统计
export const CHAPTERS_STATS = [
    { chapter: 1, ...CHAPTER_1_STATS, name: '记忆迷宫' },
    { chapter: 2, ...CHAPTER_2_STATS, name: '遗忘之境' },
    { chapter: 3, ...CHAPTER_3_STATS, name: '深海回忆' },
    { chapter: 4, ...CHAPTER_4_STATS, name: '愤怒火山' },
    { chapter: 5, ...CHAPTER_5_STATS, name: '时光回廊' },
    { chapter: 6, ...CHAPTER_6_STATS, name: '虚空边境' },
    { chapter: 7, ...CHAPTER_7_STATS, name: '记忆圣殿' },
    { chapter: 8, ...CHAPTER_8_STATS, name: '命运交织' },
    { chapter: 9, ...CHAPTER_9_STATS, name: '真相浮现' },
    { chapter: 10, ...CHAPTER_10_STATS, name: '最终回收' }
];

// 总体统计
export const LEVEL_SYSTEM_STATS = {
    totalChapters: 10,
    totalStages: 500,
    stagesPerChapter: 50,
    miniBosses: 50,      // 每章5个小Boss × 10章
    chapterBosses: 10,   // 每章1个章节Boss
    finalBoss: 1,        // 第10章最终Boss
    totalBosses: 61,
    difficultyRange: '1-15',
    enemyLevelRange: '1-500',
    
    // 按类型统计
    byType: {
        normal: 439,      // 500 - 50(小Boss) - 10(章节Boss) - 1(最终Boss)
        miniBoss: 50,
        chapterBoss: 10,
        finalBoss: 1
    }
};

// 导出各章节配置
export {
    CHAPTER_1_FULL, CHAPTER_1_STATS,
    CHAPTER_2_FULL, CHAPTER_2_STATS,
    CHAPTER_3_FULL, CHAPTER_3_STATS,
    CHAPTER_4_FULL, CHAPTER_4_STATS,
    CHAPTER_5_FULL, CHAPTER_5_STATS,
    CHAPTER_6_FULL, CHAPTER_6_STATS,
    CHAPTER_7_FULL, CHAPTER_7_STATS,
    CHAPTER_8_FULL, CHAPTER_8_STATS,
    CHAPTER_9_FULL, CHAPTER_9_STATS,
    CHAPTER_10_FULL, CHAPTER_10_STATS
};
