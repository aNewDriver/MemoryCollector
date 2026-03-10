export const CHAPTER_5_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch5_stage_${i + 1}`,
    name: `时光回廊 - 区域${i + 1}`,
    chapter: 5,
    stageNumber: i + 1,
    description: '时间循环中的战斗',
    difficulty: 5 + Math.floor(i / 10),
    enemyLevel: 201 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49
}));
export const CHAPTER_5_STATS = { totalStages: 50, difficultyRange: '5-10', enemyLevelRange: '201-250' };
