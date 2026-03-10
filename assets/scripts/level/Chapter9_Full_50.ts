export const CHAPTER_9_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch9_stage_${i + 1}`,
    name: `真相浮现 - 区域${i + 1}`,
    chapter: 9,
    stageNumber: i + 1,
    description: '真相即将揭晓',
    difficulty: 9 + Math.floor(i / 10),
    enemyLevel: 401 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49
}));
export const CHAPTER_9_STATS = { totalStages: 50, difficultyRange: '9-14', enemyLevelRange: '401-450' };
