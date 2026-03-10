export const CHAPTER_6_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch6_stage_${i + 1}`,
    name: `虚空边境 - 区域${i + 1}`,
    chapter: 6,
    stageNumber: i + 1,
    description: '现实与虚空的交界',
    difficulty: 6 + Math.floor(i / 10),
    enemyLevel: 251 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49
}));
export const CHAPTER_6_STATS = { totalStages: 50, difficultyRange: '6-11', enemyLevelRange: '251-300' };
