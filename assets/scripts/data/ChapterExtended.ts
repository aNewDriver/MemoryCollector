/**
 * 扩展章节数据
 * 第二章：遗忘之森
 * 第三章：记忆回廊
 */

import { ChapterData, LevelType, LevelData, EnemyConfig } from './PlayerData';

// 第二章：遗忘之森
export const CHAPTER_2: ChapterData = {
    id: 2,
    name: '遗忘之森',
    description: '城市边缘的原始森林，据说森林深处隐藏着关于大遗忘真相的线索。但进入森林的人，很少能完整出来。',
    totalLevels: 50,
    levels: [],
    isUnlocked: false,
    isCompleted: false
};

// 第三章：记忆回廊
export const CHAPTER_3: ChapterData = {
    id: 3,
    name: '记忆回廊',
    description: '现实与记忆的边界在这里模糊。每一个转角都可能通往某个人的过去，每一次回头都可能看见不该看见的东西。',
    totalLevels: 50,
    levels: [],
    isUnlocked: false,
    isCompleted: false
};

// 生成第二章关卡
export function generateChapter2Levels(): LevelData[] {
    const levels: LevelData[] = [];
    
    for (let i = 1; i <= 50; i++) {
        let type = LevelType.NORMAL;
        let name = `第${i}关`;
        
        if (i === 50) {
            type = LevelType.CHAPTER_BOSS;
            name = '章节Boss：森林之心';
        } else if (i % 10 === 0) {
            type = LevelType.BOSS;
            name = `Boss战：${getChapter2BossName(i)}`;
        } else if (i % 5 === 0) {
            type = LevelType.ELITE;
            name = `精英：${getChapter2EliteName(i)}`;
        }
        
        levels.push({
            id: 2000 + i,
            chapterId: 2,
            levelNumber: i,
            name,
            type,
            enemies: generateChapter2Enemies(i, type),
            rewards: generateChapter2Rewards(type),
            requiredPrevLevel: i > 1,
            isUnlocked: i === 1,
            isCompleted: false,
            stars: 0
        });
    }
    
    return levels;
}

// 生成第三章关卡
export function generateChapter3Levels(): LevelData[] {
    const levels: LevelData[] = [];
    
    for (let i = 1; i <= 50; i++) {
        let type = LevelType.NORMAL;
        let name = `第${i}关`;
        
        if (i === 50) {
            type = LevelType.CHAPTER_BOSS;
            name = '章节Boss：记忆之主';
        } else if (i % 10 === 0) {
            type = LevelType.BOSS;
            name = `Boss战：${getChapter3BossName(i)}`;
        } else if (i % 5 === 0) {
            type = LevelType.ELITE;
            name = `精英：${getChapter3EliteName(i)}`;
        }
        
        // 第三章有特殊规则关卡
        const specialRule = i % 15 === 0 ? getSpecialRule(i) : undefined;
        
        levels.push({
            id: 3000 + i,
            chapterId: 3,
            levelNumber: i,
            name,
            type,
            enemies: generateChapter3Enemies(i, type),
            rewards: generateChapter3Rewards(type),
            requiredPrevLevel: i > 1,
            isUnlocked: i === 1,
            isCompleted: false,
            stars: 0
        });
    }
    
    return levels;
}

// 第二章Boss名称
function getChapter2BossName(level: number): string {
    const bosses = ['腐化树精', '迷途猎人', '森林怨灵', '暗影狼王'];
    return bosses[(level / 10 - 1) % bosses.length];
}

function getChapter2EliteName(level: number): string {
    const elites = ['荆棘兽', '毒孢蘑菇', '寄生藤蔓', '迷失行者', '腐化小鹿'];
    return elites[(level / 5 - 1) % elites.length];
}

// 第三章Boss名称
function getChapter3BossName(level: number): string {
    const bosses = ['记忆碎片聚合体', '过去的回音', '遗忘骑士', '镜像自我'];
    return bosses[(level / 10 - 1) % bosses.length];
}

function getChapter3EliteName(level: number): string {
    const elites = ['记忆残影', '时间扭曲者', '认知错乱体', '情绪实体', '记忆吞噬者'];
    return elites[(level / 5 - 1) % elites.length];
}

// 特殊规则
function getSpecialRule(level: number): string {
    const rules = [
        '我方速度降低30%',
        '敌方攻击附带混乱效果',
        '每回合开始时随机封印一个技能',
        '治疗效果反转（变成伤害）'
    ];
    return rules[(level / 15 - 1) % rules.length];
}

// 第二章敌人配置
function generateChapter2Enemies(level: number, type: LevelType): EnemyConfig[] {
    const baseLevel = 50 + Math.floor(level / 2);
    
    switch (type) {
        case LevelType.NORMAL:
            return [
                { enemyId: 'forest_slime', level: baseLevel, position: 0 },
                { enemyId: 'forest_slime', level: baseLevel, position: 2 },
                { enemyId: 'thorn_bush', level: baseLevel + 2, position: 4 }
            ];
        case LevelType.ELITE:
            return [
                { enemyId: 'thorn_beast', level: baseLevel + 3, position: 0 },
                { enemyId: 'forest_slime', level: baseLevel, position: 2 },
                { enemyId: 'poison_spore', level: baseLevel + 5, position: 4 }
            ];
        case LevelType.BOSS:
            return [
                { enemyId: 'forest_minion', level: baseLevel, position: 0 },
                { enemyId: `forest_boss_${Math.floor(level/10)}`, level: baseLevel + 8, position: 2 },
                { enemyId: 'forest_minion', level: baseLevel, position: 4 }
            ];
        case LevelType.CHAPTER_BOSS:
            return [
                { enemyId: 'forest_guardian', level: baseLevel + 5, position: 0 },
                { enemyId: 'forest_heart', level: baseLevel + 15, position: 2 },
                { enemyId: 'forest_guardian', level: baseLevel + 5, position: 4 }
            ];
    }
}

// 第三章敌人配置
function generateChapter3Enemies(level: number, type: LevelType): EnemyConfig[] {
    const baseLevel = 100 + Math.floor(level / 2);
    
    switch (type) {
        case LevelType.NORMAL:
            return [
                { enemyId: 'memory_fragment', level: baseLevel, position: 1 },
                { enemyId: 'memory_fragment', level: baseLevel, position: 3 }
            ];
        case LevelType.ELITE:
            return [
                { enemyId: 'memory_shard', level: baseLevel + 5, position: 0 },
                { enemyId: 'memory_shard', level: baseLevel + 5, position: 2 },
                { enemyId: 'time_twister', level: baseLevel + 8, position: 4 }
            ];
        case LevelType.BOSS:
            return [
                { enemyId: 'memory_echo', level: baseLevel + 10, position: 2 }
            ];
        case LevelType.CHAPTER_BOSS:
            return [
                { enemyId: 'memory_lord_phase1', level: baseLevel + 15, position: 2 }
            ];
    }
}

// 奖励生成
function generateChapter2Rewards(type: LevelType) {
    const baseRewards = {
        [LevelType.NORMAL]: { exp: 150, gold: 750 },
        [LevelType.ELITE]: { exp: 300, gold: 1500 },
        [LevelType.BOSS]: { exp: 750, gold: 4500 },
        [LevelType.CHAPTER_BOSS]: { exp: 3000, gold: 15000 }
    };
    
    return {
        ...baseRewards[type],
        cards: type >= LevelType.BOSS ? [{ cardId: 'random_forest', chance: 35 }] : undefined,
        materials: [
            { materialId: 'forest_essence', count: type === LevelType.NORMAL ? 1 : 2, chance: 100 },
            { materialId: 'memory_dust', count: 15, chance: 100 }
        ]
    };
}

function generateChapter3Rewards(type: LevelType) {
    const baseRewards = {
        [LevelType.NORMAL]: { exp: 200, gold: 1000 },
        [LevelType.ELITE]: { exp: 400, gold: 2000 },
        [LevelType.BOSS]: { exp: 1000, gold: 6000 },
        [LevelType.CHAPTER_BOSS]: { exp: 5000, gold: 25000 }
    };
    
    return {
        ...baseRewards[type],
        cards: type >= LevelType.BOSS ? [{ cardId: 'random_epic', chance: 25 }] : undefined,
        materials: [
            { materialId: 'pure_memory', count: 1, chance: 100 },
            { materialId: 'time_shard', count: type === LevelType.CHAPTER_BOSS ? 5 : 1, chance: 100 }
        ]
    };
}
