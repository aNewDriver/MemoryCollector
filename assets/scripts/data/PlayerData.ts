/**
 * 玩家数据管理
 * 存储玩家全局进度和数据
 */

import { CardInstance, Rarity } from './CardData';

export interface PlayerData {
    // 基础信息
    name: string;
    level: number;
    exp: number;
    
    // 资源
    gold: number;
    soulCrystal: number;  // 魂晶 - 高级货币
    friendPoints: number; // 友情点
    
    // 游戏进度
    currentChapter: number;      // 当前章节
    currentLevel: number;        // 当前关卡（在章节内的进度）
    highestTowerFloor: number;   // 爬塔最高层
    
    // 收集
    ownedCards: CardInstance[];
    unlockedStories: string[];
    achievements: string[];
    
    // 设置
    settings: GameSettings;
}

export interface GameSettings {
    bgmVolume: number;
    sfxVolume: number;
    vibration: boolean;
    notifications: boolean;
}

// 章节数据
export interface ChapterData {
    id: number;
    name: string;
    description: string;
    totalLevels: number;
    levels: LevelData[];
    isUnlocked: boolean;
    isCompleted: boolean;
}

export interface LevelData {
    id: number;
    chapterId: number;
    levelNumber: number;  // 在章节中的序号 1-50
    name: string;
    
    // 关卡类型
    type: LevelType;
    
    // 敌人配置
    enemies: EnemyConfig[];
    
    // 奖励
    rewards: RewardData;
    
    // 解锁条件
    requiredLevel?: number;
    requiredPrevLevel?: boolean;  // 是否需要通关上一关
    
    // 状态
    isUnlocked: boolean;
    isCompleted: boolean;
    stars: number;  // 0-3星
}

export enum LevelType {
    NORMAL = 'normal',      // 普通关卡
    ELITE = 'elite',        // 精英关卡（每5关）
    BOSS = 'boss',          // Boss关卡（每10关）
    CHAPTER_BOSS = 'chapter_boss'  // 章节Boss（第50关）
}

export interface EnemyConfig {
    enemyId: string;
    level: number;
    position: number;  // 0-4 站位
}

export interface RewardData {
    exp: number;
    gold: number;
    cards?: { cardId: string; chance: number }[];
    equipment?: { equipmentId: string; chance: number }[];
    materials?: { materialId: string; count: number; chance: number }[];
}

// 爬塔层数据
export interface TowerFloorData {
    floor: number;
    name: string;
    enemies: EnemyConfig[];
    rewards: RewardData;
    specialRule?: string;  // 特殊规则（如：敌人攻击翻倍）
}

export class PlayerDataManager {
    private playerData: PlayerData;
    private chapters: Map<number, ChapterData> = new Map();
    
    constructor() {
        // 初始化默认数据
        this.playerData = this.createDefaultPlayerData();
        this.initChapters();
    }
    
    private createDefaultPlayerData(): PlayerData {
        return {
            name: '回收者',
            level: 1,
            exp: 0,
            gold: 10000,
            soulCrystal: 300,
            friendPoints: 0,
            currentChapter: 1,
            currentLevel: 1,
            highestTowerFloor: 0,
            ownedCards: [],
            unlockedStories: [],
            achievements: [],
            settings: {
                bgmVolume: 0.7,
                sfxVolume: 0.8,
                vibration: true,
                notifications: true
            }
        };
    }
    
    // 初始化章节数据
    private initChapters() {
        // 第一章：遗忘之城
        const chapter1: ChapterData = {
            id: 1,
            name: '遗忘之城',
            description: '这里曾是最繁华的都市，如今只剩废墟。记忆的碎片在风中飘散。',
            totalLevels: 50,
            levels: this.generateChapterLevels(1),
            isUnlocked: true,
            isCompleted: false
        };
        this.chapters.set(1, chapter1);
    }
    
    private generateChapterLevels(chapterId: number): LevelData[] {
        const levels: LevelData[] = [];
        
        for (let i = 1; i <= 50; i++) {
            let type = LevelType.NORMAL;
            let name = `第${i}关`;
            
            if (i === 50) {
                type = LevelType.CHAPTER_BOSS;
                name = '章节Boss：遗忘之主';
            } else if (i % 10 === 0) {
                type = LevelType.BOSS;
                name = `Boss战：${this.getBossName(chapterId, i)}`;
            } else if (i % 5 === 0) {
                type = LevelType.ELITE;
                name = `精英：${this.getEliteName(chapterId, i)}`;
            }
            
            levels.push({
                id: chapterId * 1000 + i,
                chapterId,
                levelNumber: i,
                name,
                type,
                enemies: this.generateEnemies(chapterId, i, type),
                rewards: this.generateRewards(type),
                requiredPrevLevel: i > 1,
                isUnlocked: i === 1,
                isCompleted: false,
                stars: 0
            });
        }
        
        return levels;
    }
    
    private getBossName(chapter: number, level: number): string {
        const bosses = ['废墟守卫', '记忆掠夺者', '遗忘猎手', '破碎骑士'];
        return bosses[(level / 10 - 1) % bosses.length];
    }
    
    private getEliteName(chapter: number, level: number): string {
        return `精英敌人${level}`;
    }
    
    private generateEnemies(chapter: number, level: number, type: LevelType): EnemyConfig[] {
        // 根据关卡类型和进度生成敌人
        const baseLevel = (chapter - 1) * 10 + Math.floor(level / 5);
        
        switch (type) {
            case LevelType.NORMAL:
                return [
                    { enemyId: 'enemy_slime', level: baseLevel, position: 0 },
                    { enemyId: 'enemy_slime', level: baseLevel, position: 1 },
                    { enemyId: 'enemy_skeleton', level: baseLevel + 1, position: 2 }
                ];
            case LevelType.ELITE:
                return [
                    { enemyId: 'enemy_skeleton', level: baseLevel + 2, position: 0 },
                    { enemyId: 'enemy_wolf', level: baseLevel + 3, position: 2 },
                    { enemyId: 'enemy_skeleton', level: baseLevel + 2, position: 4 }
                ];
            case LevelType.BOSS:
                return [
                    { enemyId: 'enemy_minion', level: baseLevel + 1, position: 0 },
                    { enemyId: `boss_${Math.floor(level/10)}`, level: baseLevel + 5, position: 2 },
                    { enemyId: 'enemy_minion', level: baseLevel + 1, position: 4 }
                ];
            case LevelType.CHAPTER_BOSS:
                return [
                    { enemyId: 'enemy_elite_guard', level: baseLevel + 3, position: 0 },
                    { enemyId: 'enemy_elite_guard', level: baseLevel + 3, position: 1 },
                    { enemyId: 'chapter_boss_1', level: baseLevel + 10, position: 2 },
                    { enemyId: 'enemy_elite_guard', level: baseLevel + 3, position: 3 },
                    { enemyId: 'enemy_elite_guard', level: baseLevel + 3, position: 4 }
                ];
        }
    }
    
    private generateRewards(type: LevelType): RewardData {
        const baseRewards = {
            [LevelType.NORMAL]: { exp: 100, gold: 500 },
            [LevelType.ELITE]: { exp: 200, gold: 1000 },
            [LevelType.BOSS]: { exp: 500, gold: 3000 },
            [LevelType.CHAPTER_BOSS]: { exp: 2000, gold: 10000 }
        };
        
        return {
            ...baseRewards[type],
            cards: type >= LevelType.BOSS ? [{ cardId: 'random', chance: 30 }] : undefined,
            materials: [{ materialId: 'memory_dust', count: 10, chance: 100 }]
        };
    }
    
    // ============ 公共接口 ============
    
    public getPlayerData(): PlayerData {
        return this.playerData;
    }
    
    public getMainCard(): CardInstance | null {
        // 返回当前设置的主力卡牌，或第一张拥有的卡牌
        return this.playerData.ownedCards[0] || null;
    }
    
    public getChapter(chapterId: number): ChapterData | undefined {
        return this.chapters.get(chapterId);
    }
    
    public getAllChapters(): ChapterData[] {
        return Array.from(this.chapters.values());
    }
    
    public getLevel(chapterId: number, levelNumber: number): LevelData | undefined {
        const chapter = this.chapters.get(chapterId);
        return chapter?.levels.find(l => l.levelNumber === levelNumber);
    }
    
    // 通关关卡
    public completeLevel(chapterId: number, levelNumber: number, stars: number): void {
        const level = this.getLevel(chapterId, levelNumber);
        if (!level) return;
        
        level.isCompleted = true;
        level.stars = Math.max(level.stars, stars);
        
        // 解锁下一关
        const nextLevel = this.getLevel(chapterId, levelNumber + 1);
        if (nextLevel) {
            nextLevel.isUnlocked = true;
        }
        
        // 如果是章节Boss，标记章节完成
        if (level.type === LevelType.CHAPTER_BOSS) {
            const chapter = this.chapters.get(chapterId);
            if (chapter) chapter.isCompleted = true;
            // TODO: 解锁下一章节
        }
        
        // 更新玩家进度
        if (chapterId === this.playerData.currentChapter && levelNumber === this.playerData.currentLevel) {
            this.playerData.currentLevel = levelNumber + 1;
            if (this.playerData.currentLevel > 50) {
                this.playerData.currentChapter++;
                this.playerData.currentLevel = 1;
            }
        }
    }
    
    // 获取经验到下一级
    public getExpToNextLevel(): number {
        return Math.floor(100 * Math.pow(1.1, this.playerData.level));
    }
    
    // 添加资源
    public addGold(amount: number): void {
        this.playerData.gold += amount;
    }
    
    public addSoulCrystal(amount: number): void {
        this.playerData.soulCrystal += amount;
    }
    
    // 保存/加载
    public save(): void {
        // TODO: 本地存储或服务器存档
        const data = JSON.stringify(this.playerData);
        localStorage.setItem('memory_collector_save', data);
    }
    
    public load(): void {
        const data = localStorage.getItem('memory_collector_save');
        if (data) {
            this.playerData = JSON.parse(data);
        }
    }
}

// 单例
export const playerDataManager = new PlayerDataManager();
