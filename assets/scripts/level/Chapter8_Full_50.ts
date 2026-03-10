export const CHAPTER_8_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch8_stage_${i + 1}`,
    name: `命运交织 - 区域${i + 1}`,
    chapter: 8,
    stageNumber: i + 1,
    description: '命运之网开始编织',
    difficulty: 8 + Math.floor(i / 10),
    enemyLevel: 351 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49
}));
export const CHAPTER_8_STATS = { totalStages: 50, difficultyRange: '8-13', enemyLevelRange: '351-400' };
