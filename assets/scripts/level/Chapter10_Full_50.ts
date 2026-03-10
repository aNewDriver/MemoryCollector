export const CHAPTER_10_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch10_stage_${i + 1}`,
    name: `最终回收 - 区域${i + 1}`,
    chapter: 10,
    stageNumber: i + 1,
    description: i === 49 ? '最终Boss战 - 记忆之主' : '最后的战斗',
    difficulty: 10 + Math.floor(i / 10),
    enemyLevel: 451 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49,
    isFinalLevel: i === 49
}));
export const CHAPTER_10_STATS = { totalStages: 50, difficultyRange: '10-15', enemyLevelRange: '451-500' };
