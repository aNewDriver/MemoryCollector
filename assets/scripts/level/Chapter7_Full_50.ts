export const CHAPTER_7_FULL = Array.from({ length: 50 }, (_, i) => ({
    id: `ch7_stage_${i + 1}`,
    name: `记忆圣殿 - 区域${i + 1}`,
    chapter: 7,
    stageNumber: i + 1,
    description: '守护终极记忆的圣殿',
    difficulty: 7 + Math.floor(i / 10),
    enemyLevel: 301 + i,
    isBossLevel: (i + 1) % 10 === 0,
    isChapterBoss: i === 49
}));
export const CHAPTER_7_STATS = { totalStages: 50, difficultyRange: '7-12', enemyLevelRange: '301-350' };
