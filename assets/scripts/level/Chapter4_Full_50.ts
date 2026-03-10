export const CHAPTER_4_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch4_stage_${i + 1}`,
    name: `愤怒火山 - 区域${i + 1}`,
    chapter: 4,
    stageNumber: i + 1,
    description: '怒火中燃烧的记忆',
    difficulty: 4 + Math.floor(i / 10),
    enemyLevel: 151 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49
}));
export const CHAPTER_4_STATS = { totalStages: 50, difficultyRange: '4-9', enemyLevelRange: '151-200' };
