/**
 * 每日副本系统
 * 提供稳定的资源获取途径
 */

export enum DailyDungeonType {
    GOLD = 'gold',           // 金币副本
    EXP = 'exp',             // 经验副本
    MATERIAL = 'material',   // 材料副本
    EQUIPMENT = 'equipment', // 装备副本
    AWAKENING = 'awakening'  // 觉醒材料副本
}

export interface DailyDungeon {
    id: DailyDungeonType;
    name: string;
    description: string;
    
    // 开放时间
    openDays: number[];  // 0-6, 周日=0
    
    // 难度等级
    difficulties: DungeonDifficulty[];
    
    // 每日次数限制
    dailyAttempts: number;
}

export interface DungeonDifficulty {
    level: number;
    name: string;
    recommendedPower: number;
    enemies: DungeonEnemy[];
    rewards: DungeonReward;
    unlockRequirement?: {
        playerLevel?: number;
        clearPrevious?: boolean;
    };
}

export interface DungeonEnemy {
    enemyId: string;
    level: number;
    count: number;
    isBoss?: boolean;
}

export interface DungeonReward {
    gold?: number;
    exp?: number;
    items: { itemId: string; count: number; chance: number }[];
}

// 每日副本配置
export const DAILY_DUNGEONS: DailyDungeon[] = [
    {
        id: DailyDungeonType.GOLD,
        name: '金矿洞窟',
        description: '废弃的金矿中仍有大量金币等待发掘',
        openDays: [0, 1, 2, 3, 4, 5, 6],  // 每天开放
        difficulties: [
            {
                level: 1,
                name: '简单',
                recommendedPower: 1000,
                enemies: [{ enemyId: 'gold_slime', level: 20, count: 3 }],
                rewards: { gold: 10000, items: [] }
            },
            {
                level: 2,
                name: '普通',
                recommendedPower: 3000,
                enemies: [
                    { enemyId: 'gold_slime', level: 40, count: 3 },
                    { enemyId: 'gold_guardian', level: 45, count: 1 }
                ],
                rewards: { gold: 30000, items: [] },
                unlockRequirement: { playerLevel: 20 }
            },
            {
                level: 3,
                name: '困难',
                recommendedPower: 6000,
                enemies: [
                    { enemyId: 'gold_guardian', level: 60, count: 2 },
                    { enemyId: 'gold_dragon', level: 65, count: 1, isBoss: true }
                ],
                rewards: { gold: 60000, items: [{ itemId: 'gold_chest', count: 1, chance: 30 }] },
                unlockRequirement: { playerLevel: 40, clearPrevious: true }
            },
            {
                level: 4,
                name: '噩梦',
                recommendedPower: 10000,
                enemies: [
                    { enemyId: 'gold_dragon', level: 80, count: 2, isBoss: true }
                ],
                rewards: { gold: 100000, items: [{ itemId: 'gold_chest_large', count: 1, chance: 50 }] },
                unlockRequirement: { playerLevel: 60, clearPrevious: true }
            }
        ],
        dailyAttempts: 3
    },
    {
        id: DailyDungeonType.EXP,
        name: '记忆漩涡',
        description: '强烈的记忆波动可以快速提升卡牌经验',
        openDays: [0, 1, 2, 3, 4, 5, 6],
        difficulties: [
            {
                level: 1,
                name: '简单',
                recommendedPower: 1000,
                enemies: [{ enemyId: 'memory_fragment_weak', level: 20, count: 5 }],
                rewards: { 
                    items: [{ itemId: 'memory_dust_small', count: 10, chance: 100 }] 
                }
            },
            {
                level: 2,
                name: '普通',
                recommendedPower: 3000,
                enemies: [
                    { enemyId: 'memory_fragment', level: 40, count: 4 },
                    { enemyId: 'memory_collector', level: 45, count: 1 }
                ],
                rewards: { 
                    items: [
                        { itemId: 'memory_dust', count: 15, chance: 100 },
                        { itemId: 'memory_dust_large', count: 2, chance: 30 }
                    ] 
                },
                unlockRequirement: { playerLevel: 20 }
            },
            {
                level: 3,
                name: '困难',
                recommendedPower: 6000,
                enemies: [
                    { enemyId: 'memory_collector', level: 60, count: 2 },
                    { enemyId: 'memory_lord_small', level: 65, count: 1, isBoss: true }
                ],
                rewards: { 
                    items: [
                        { itemId: 'memory_dust_large', count: 5, chance: 100 },
                        { itemId: 'exp_potion', count: 1, chance: 50 }
                    ] 
                },
                unlockRequirement: { playerLevel: 40, clearPrevious: true }
            },
            {
                level: 4,
                name: '噩梦',
                recommendedPower: 10000,
                enemies: [
                    { enemyId: 'memory_lord_small', level: 80, count: 2, isBoss: true }
                ],
                rewards: { 
                    items: [
                        { itemId: 'memory_dust_large', count: 10, chance: 100 },
                        { itemId: 'exp_potion_super', count: 1, chance: 50 }
                    ] 
                },
                unlockRequirement: { playerLevel: 60, clearPrevious: true }
            }
        ],
        dailyAttempts: 3
    },
    {
        id: DailyDungeonType.MATERIAL,
        name: '元素秘境',
        description: '元素力量汇聚之地，可获得各种突破材料',
        openDays: [1, 3, 5],  // 周一三五
        difficulties: [
            {
                level: 1,
                name: '简单',
                recommendedPower: 2000,
                enemies: [{ enemyId: 'elemental_spirit', level: 30, count: 3 }],
                rewards: { 
                    items: [
                        { itemId: 'ascension_stone', count: 5, chance: 100 },
                        { itemId: 'elemental_core', count: 2, chance: 50 }
                    ] 
                }
            },
            {
                level: 2,
                name: '普通',
                recommendedPower: 4000,
                enemies: [
                    { enemyId: 'elemental_spirit', level: 50, count: 3 },
                    { enemyId: 'elemental_lord', level: 55, count: 1 }
                ],
                rewards: { 
                    items: [
                        { itemId: 'ascension_stone', count: 10, chance: 100 },
                        { itemId: 'elemental_core', count: 5, chance: 80 },
                        { itemId: 'ascension_core', count: 1, chance: 30 }
                    ] 
                },
                unlockRequirement: { playerLevel: 30 }
            },
            {
                level: 3,
                name: '困难',
                recommendedPower: 7000,
                enemies: [
                    { enemyId: 'elemental_lord', level: 70, count: 2 },
                    { enemyId: 'elemental_king', level: 75, count: 1, isBoss: true }
                ],
                rewards: { 
                    items: [
                        { itemId: 'ascension_core', count: 3, chance: 100 },
                        { itemId: 'elemental_crystal', count: 2, chance: 50 }
                    ] 
                },
                unlockRequirement: { playerLevel: 50, clearPrevious: true }
            }
        ],
        dailyAttempts: 2
    },
    {
        id: DailyDungeonType.EQUIPMENT,
        name: '铁匠的试炼',
        description: '击败守护者，获得稀有装备',
        openDays: [2, 4, 6],  // 周二四六
        difficulties: [
            {
                level: 1,
                name: '简单',
                recommendedPower: 2500,
                enemies: [{ enemyId: 'equipment_guardian', level: 35, count: 1 }],
                rewards: { 
                    items: [
                        { itemId: 'eq_box_common', count: 1, chance: 80 },
                        { itemId: 'eq_box_rare', count: 1, chance: 20 }
                    ] 
                }
            },
            {
                level: 2,
                name: '普通',
                recommendedPower: 5000,
                enemies: [
                    { enemyId: 'equipment_guardian', level: 55, count: 2 }
                ],
                rewards: { 
                    items: [
                        { itemId: 'eq_box_rare', count: 1, chance: 70 },
                        { itemId: 'eq_box_epic', count: 1, chance: 30 }
                    ] 
                },
                unlockRequirement: { playerLevel: 35 }
            },
            {
                level: 3,
                name: '困难',
                recommendedPower: 8000,
                enemies: [
                    { enemyId: 'equipment_guardian_elite', level: 75, count: 1 },
                    { enemyId: 'forge_master', level: 80, count: 1, isBoss: true }
                ],
                rewards: { 
                    items: [
                        { itemId: 'eq_box_epic', count: 1, chance: 60 },
                        { itemId: 'eq_box_legend', count: 1, chance: 20 }
                    ] 
                },
                unlockRequirement: { playerLevel: 55, clearPrevious: true }
            }
        ],
        dailyAttempts: 2
    },
    {
        id: DailyDungeonType.AWAKENING,
        name: '觉醒圣殿',
        description: '只有最强大的回收者才能进入，获取觉醒材料',
        openDays: [0],  // 仅周日
        difficulties: [
            {
                level: 1,
                name: '试炼',
                recommendedPower: 8000,
                enemies: [
                    { enemyId: 'awakening_guardian', level: 70, count: 3 }
                ],
                rewards: { 
                    items: [
                        { itemId: 'awakening_crystal', count: 5, chance: 100 },
                        { itemId: 'awakening_core', count: 1, chance: 30 }
                    ] 
                }
            },
            {
                level: 2,
                name: '挑战',
                recommendedPower: 12000,
                enemies: [
                    { enemyId: 'awakening_guardian_elite', level: 90, count: 2 },
                    { enemyId: 'awakening_sage', level: 95, count: 1, isBoss: true }
                ],
                rewards: { 
                    items: [
                        { itemId: 'awakening_crystal', count: 10, chance: 100 },
                        { itemId: 'awakening_core', count: 3, chance: 50 },
                        { itemId: 'awakening_gem', count: 1, chance: 20 }
                    ] 
                },
                unlockRequirement: { playerLevel: 70, clearPrevious: true }
            }
        ],
        dailyAttempts: 1
    }
];

export class DailyDungeonSystem {
    private attemptCount: Map<DailyDungeonType, number> = new Map();
    private lastResetDate: string = '';
    
    constructor() {
        this.resetDailyAttempts();
    }
    
    // 获取今日开放的副本
    public getOpenDungeons(): DailyDungeon[] {
        const today = new Date().getDay();
        return DAILY_DUNGEONS.filter(d => d.openDays.includes(today));
    }
    
    // 获取所有副本
    public getAllDungeons(): DailyDungeon[] {
        return DAILY_DUNGEONS;
    }
    
    // 获取剩余次数
    public getRemainingAttempts(dungeonType: DailyDungeonType): number {
        const dungeon = DAILY_DUNGEONS.find(d => d.id === dungeonType);
        if (!dungeon) return 0;
        
        const used = this.attemptCount.get(dungeonType) || 0;
        return Math.max(0, dungeon.dailyAttempts - used);
    }
    
    // 使用次数
    public useAttempt(dungeonType: DailyDungeonType): boolean {
        const remaining = this.getRemainingAttempts(dungeonType);
        if (remaining <= 0) return false;
        
        const used = this.attemptCount.get(dungeonType) || 0;
        this.attemptCount.set(dungeonType, used + 1);
        return true;
    }
    
    // 重置每日次数
    public resetDailyAttempts(): void {
        const today = new Date().toDateString();
        if (this.lastResetDate !== today) {
            this.attemptCount.clear();
            this.lastResetDate = today;
        }
    }
    
    // 获取副本详情
    public getDungeon(dungeonType: DailyDungeonType): DailyDungeon | undefined {
        return DAILY_DUNGEONS.find(d => d.id === dungeonType);
    }
    
    // 检查难度是否解锁
    public isDifficultyUnlocked(
        dungeonType: DailyDungeonType, 
        difficultyLevel: number,
        playerLevel: number,
        clearedDifficulties: number[]
    ): boolean {
        const dungeon = this.getDungeon(dungeonType);
        if (!dungeon) return false;
        
        const difficulty = dungeon.difficulties.find(d => d.level === difficultyLevel);
        if (!difficulty) return false;
        
        if (!difficulty.unlockRequirement) return true;
        
        if (difficulty.unlockRequirement.playerLevel && 
            playerLevel < difficulty.unlockRequirement.playerLevel) {
            return false;
        }
        
        if (difficulty.unlockRequirement.clearPrevious && 
            !clearedDifficulties.includes(difficultyLevel - 1)) {
            return false;
        }
        
        return true;
    }
}

// 单例
export const dailyDungeonSystem = new DailyDungeonSystem();
