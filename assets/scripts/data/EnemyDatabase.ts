/**
 * 敌人数据库 - 覆盖500关所需的所有敌人
 * 简化版核心敌人数据
 */

export interface EnemySkill {
    name: string;
    description: string;
    damage: number;
    effect?: string;
}

export interface EnemyData {
    id: string;
    name: string;
    type: 'normal' | 'elite' | 'boss';
    element: string;
    level: number;
    stats: {
        hp: number;
        atk: number;
        def: number;
        spd: number;
        crt: number;
        cdmg: number;
    };
    skills: EnemySkill[];
    aiType: string;
    rewards: {
        exp: number;
        gold: number;
        memoryShards: number;
    };
}

// ==================== 第一章：记忆迷宫敌人 ====================
const CHAPTER_1_ENEMIES: EnemyData[] = [
    // 普通敌人
    { id: 'shadow_minion_001', name: '暗影仆从', type: 'normal', element: 'dark', level: 1, stats: { hp: 100, atk: 15, def: 5, spd: 8, crt: 5, cdmg: 120 }, skills: [{ name: '暗影爪', description: '造成攻击100%伤害', damage: 100 }], aiType: 'basic', rewards: { exp: 10, gold: 20, memoryShards: 1 } },
    { id: 'paper_wisp_001', name: '纸灵', type: 'normal', element: 'light', level: 1, stats: { hp: 80, atk: 12, def: 3, spd: 12, crt: 8, cdmg: 130 }, skills: [{ name: '纸刃', description: '造成攻击90%伤害', damage: 90 }], aiType: 'fast', rewards: { exp: 8, gold: 15, memoryShards: 1 } },
    { id: 'ink_spirit_001', name: '墨水精灵', type: 'normal', element: 'water', level: 2, stats: { hp: 120, atk: 18, def: 6, spd: 10, crt: 6, cdmg: 125 }, skills: [{ name: '墨击', description: '造成攻击100%伤害', damage: 100 }, { name: '墨染', description: '降低目标5%命中', damage: 80, effect: 'blind' }], aiType: 'debuffer', rewards: { exp: 12, gold: 25, memoryShards: 2 } },
    { id: 'echo_ghost_001', name: '回声幽灵', type: 'normal', element: 'dark', level: 2, stats: { hp: 90, atk: 14, def: 4, spd: 15, crt: 10, cdmg: 140 }, skills: [{ name: '回声', description: '造成攻击85%伤害，连续2次', damage: 85 }], aiType: 'multi_hit', rewards: { exp: 11, gold: 22, memoryShards: 2 } },
    { id: 'mirror_shard_001', name: '镜片碎片', type: 'normal', element: 'light', level: 2, stats: { hp: 110, atk: 16, def: 8, spd: 9, crt: 7, cdmg: 128 }, skills: [{ name: '折射', description: '造成攻击100%伤害', damage: 100 }, { name: '反射', description: '反弹10%伤害', damage: 0, effect: 'reflect' }], aiType: 'defensive', rewards: { exp: 13, gold: 26, memoryShards: 2 } },
    { id: 'whisper_spirit_001', name: '低语灵', type: 'normal', element: 'dark', level: 2, stats: { hp: 85, atk: 13, def: 4, spd: 14, crt: 9, cdmg: 135 }, skills: [{ name: '低语', description: '造成攻击80%伤害，降低目标攻击力10%', damage: 80, effect: 'atk_down' }], aiType: 'debuffer', rewards: { exp: 10, gold: 20, memoryShards: 1 } },
    { id: 'shadow_stalker_001', name: '暗影潜行者', type: 'normal', element: 'dark', level: 3, stats: { hp: 140, atk: 22, def: 7, spd: 18, crt: 15, cdmg: 150 }, skills: [{ name: '背刺', description: '造成攻击150%伤害', damage: 150 }], aiType: 'assassin', rewards: { exp: 15, gold: 30, memoryShards: 2 } },
    { id: 'mirror_self_001', name: '镜中自我', type: 'elite', element: 'light', level: 3, stats: { hp: 200, atk: 25, def: 12, spd: 11, crt: 12, cdmg: 145 }, skills: [{ name: '镜像', description: '复制玩家属性50%', damage: 100, effect: 'mirror' }], aiType: 'mimic', rewards: { exp: 25, gold: 50, memoryShards: 3 } },
    { id: 'ink_leviathan_001', name: '墨水巨兽', type: 'elite', element: 'water', level: 3, stats: { hp: 350, atk: 30, def: 15, spd: 6, crt: 5, cdmg: 120 }, skills: [{ name: '墨浪', description: '造成攻击120%范围伤害', damage: 120 }], aiType: 'aoe', rewards: { exp: 30, gold: 60, memoryShards: 4 } },
    
    // Boss敌人
    { id: 'gate_guardian_001', name: '迷宫守门人', type: 'boss', element: 'earth', level: 5, stats: { hp: 800, atk: 45, def: 30, spd: 8, crt: 10, cdmg: 140 }, skills: [{ name: '重击', description: '造成攻击150%伤害', damage: 150 }, { name: '守护', description: '提升50%防御', damage: 0, effect: 'def_up' }], aiType: 'tank_boss', rewards: { exp: 100, gold: 200, memoryShards: 10 } },
    { id: 'junior_guardian_001', name: '初级守护者', type: 'boss', element: 'metal', level: 10, stats: { hp: 1500, atk: 70, def: 50, spd: 10, crt: 15, cdmg: 150 }, skills: [{ name: '金属风暴', description: '造成攻击180%伤害', damage: 180 }, { name: '护盾', description: '获得500护盾', damage: 0, effect: 'shield' }], aiType: 'balanced_boss', rewards: { exp: 150, gold: 300, memoryShards: 15 } },
    { id: 'labyrinth_master_001', name: '迷宫之主', type: 'boss', element: 'dark', level: 15, stats: { hp: 3000, atk: 120, def: 80, spd: 15, crt: 20, cdmg: 160 }, skills: [{ name: '迷宫领域', description: '造成攻击200%伤害', damage: 200 }, { name: '记忆抽取', description: '偷取玩家1个增益', damage: 100, effect: 'steal_buff' }, { name: '暗影再生', description: '恢复20%生命', damage: 0, effect: 'heal' }], aiType: 'final_boss', rewards: { exp: 300, gold: 600, memoryShards: 30 } },
];

// ==================== 第2-10章简化敌人模板 ====================
const CHAPTER_TEMPLATES = [ 
    { chapter: 2, name: '遗忘之境', prefix: 'forgotten', baseLevel: 20, element: 'dark' },
    { chapter: 3, name: '深海回忆', prefix: 'abyss', baseLevel: 40, element: 'water' },
    { chapter: 4, name: '愤怒火山', prefix: 'magma', baseLevel: 60, element: 'fire' },
    { chapter: 5, name: '时光回廊', prefix: 'chrono', baseLevel: 80, element: 'light' },
    { chapter: 6, name: '虚空边境', prefix: 'void', baseLevel: 100, element: 'dark' },
    { chapter: 7, name: '记忆圣殿', prefix: 'sanctum', baseLevel: 120, element: 'light' },
    { chapter: 8, name: '命运交织', prefix: 'fate', baseLevel: 140, element: 'metal' },
    { chapter: 9, name: '真相浮现', prefix: 'truth', baseLevel: 160, element: 'water' },
    { chapter: 10, name: '最终回收', prefix: 'ultimate', baseLevel: 180, element: 'fire' },
];

// 生成第2-10章敌人
const generateChapterEnemies = (chapter: number, template: any): EnemyData[] => {
    const enemies: EnemyData[] = [];
    const { name, prefix, baseLevel, element } = template;
    
    // 普通敌人 (每章20种)
    for (let i = 1; i <= 20; i++) {
        const level = baseLevel + i * 2;
        const tier = Math.ceil(i / 5); // 1-4级
        enemies.push({
            id: `${prefix}_enemy_${i}`,
            name: `${name}守卫 ${i}`,
            type: 'normal',
            element,
            level,
            stats: {
                hp: 200 + level * 20 * tier,
                atk: 30 + level * 3 * tier,
                def: 15 + level * 1.5 * tier,
                spd: 10 + tier * 2,
                crt: 5 + tier * 2,
                cdmg: 120 + tier * 10
            },
            skills: [{ name: '攻击', description: '造成攻击100%伤害', damage: 100 }],
            aiType: 'basic',
            rewards: { exp: level * 2, gold: level * 3, memoryShards: tier }
        });
    }
    
    // 精英敌人 (每章10种)
    for (let i = 1; i <= 10; i++) {
        const level = baseLevel + 40 + i * 3;
        enemies.push({
            id: `${prefix}_elite_${i}`,
            name: `${name}精英 ${i}`,
            type: 'elite',
            element,
            level,
            stats: {
                hp: 500 + level * 30,
                atk: 50 + level * 4,
                def: 30 + level * 2,
                spd: 12 + i,
                crt: 10 + i,
                cdmg: 140 + i * 2
            },
            skills: [
                { name: '重击', description: '造成攻击120%伤害', damage: 120 },
                { name: '强化', description: '攻击力提升20%', damage: 0, effect: 'buff' }
            ],
            aiType: 'elite',
            rewards: { exp: level * 4, gold: level * 6, memoryShards: 5 + i }
        });
    }
    
    // Boss敌人 (每章5个：4小Boss + 1章节Boss)
    for (let i = 1; i <= 4; i++) {
        const level = baseLevel + 60 + i * 10;
        enemies.push({
            id: `${prefix}_miniboss_${i}`,
            name: `${name}守护者 ${i}`,
            type: 'boss',
            element,
            level,
            stats: {
                hp: 2000 + level * 50,
                atk: 100 + level * 5,
                def: 60 + level * 3,
                spd: 15 + i,
                crt: 15 + i * 2,
                cdmg: 160
            },
            skills: [
                { name: '毁灭', description: '造成攻击150%伤害', damage: 150 },
                { name: '怒吼', description: '全体敌人攻击力提升', damage: 0, effect: 'aoe_buff' }
            ],
            aiType: 'mini_boss',
            rewards: { exp: level * 10, gold: level * 15, memoryShards: 20 + i * 5 }
        });
    }
    
    // 章节最终Boss
    enemies.push({
        id: `${prefix}_boss`,
        name: `${name}之主`,
        type: 'boss',
        element,
        level: baseLevel + 100,
        stats: {
            hp: 10000 + baseLevel * 100,
            atk: 300 + baseLevel * 10,
            def: 200 + baseLevel * 5,
            spd: 20,
            crt: 25,
            cdmg: 180
        },
        skills: [
            { name: '终极技能', description: '造成攻击250%伤害', damage: 250 },
            { name: '召唤', description: '召唤2个精英随从', damage: 0, effect: 'summon' },
            { name: '再生', description: '恢复30%生命', damage: 0, effect: 'heal' }
        ],
        aiType: 'chapter_boss',
        rewards: { exp: (baseLevel + 100) * 20, gold: (baseLevel + 100) * 30, memoryShards: 100 }
    });
    
    return enemies;
};

// 生成第2-10章所有敌人
const CHAPTER_2_10_ENEMIES: EnemyData[] = [];
for (const template of CHAPTER_TEMPLATES) {
    CHAPTER_2_10_ENEMIES.push(...generateChapterEnemies(template.chapter, template));
}

// ==================== 合并所有敌人 ====================
export const ENEMY_DATABASE: EnemyData[] = [
    ...CHAPTER_1_ENEMIES,
    ...CHAPTER_2_10_ENEMIES
];

// 快速查找
export const ENEMY_MAP = new Map(ENEMY_DATABASE.map(e => [e.id, e]));

// 按章节获取敌人
export const getEnemiesByChapter = (chapter: number): EnemyData[] => {
    if (chapter === 1) return CHAPTER_1_ENEMIES;
    const template = CHAPTER_TEMPLATES.find(t => t.chapter === chapter);
    if (!template) return [];
    return generateChapterEnemies(chapter, template);
};

// 总敌人数量
export const ENEMY_STATS = {
    totalEnemies: ENEMY_DATABASE.length,
    chapter1Enemies: CHAPTER_1_ENEMIES.length,
    otherChapters: CHAPTER_2_10_ENEMIES.length,
    normalEnemies: ENEMY_DATABASE.filter(e => e.type === 'normal').length,
    eliteEnemies: ENEMY_DATABASE.filter(e => e.type === 'elite').length,
    bossEnemies: ENEMY_DATABASE.filter(e => e.type === 'boss').length
};

console.log('敌人数据库加载完成:', ENEMY_STATS);
