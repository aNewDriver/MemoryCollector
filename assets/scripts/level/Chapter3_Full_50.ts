export const CHAPTER_3_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch3_stage_${i + 1}`,
    name: `深海回忆 - 区域${i + 1}`,
    chapter: 3,
    stageNumber: i + 1,
    description: '深海的记忆，被水压封印',
    difficulty: 3 + Math.floor(i / 10),
    enemyLevel: 101 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49
}));
export const CHAPTER_3_STATS = { totalStages: 50, difficultyRange: '3-8', enemyLevelRange: '101-150' };
