/**
 * 图鉴系统
 * 记录已收集的卡牌、敌人、物品等
 */

import { getAllCards, CardData } from '../data/CardData';

export interface CollectionCategory {
    id: string;
    name: string;
    icon: string;
    totalCount: number;
    collectedCount: number;
}

export interface CardCollectionEntry {
    cardId: string;
    owned: boolean;
    starLevel: number;  // 收集度：1-5星
    obtainedAt?: number;
    affinityLevel: number;
    storyUnlocked: boolean[];  // 3个记忆剧情是否解锁
}

export interface EnemyCollectionEntry {
    enemyId: string;
    name: string;
    encountered: boolean;
    defeated: boolean;
    defeatCount: number;
    firstEncounterAt?: number;
    description: string;
}

export interface AchievementCollectionEntry {
    achievementId: string;
    name: string;
    description: string;
    completed: boolean;
    completedAt?: number;
    progress: number;
    maxProgress: number;
}

export class CollectionSystem {
    private cardCollection: Map<string, CardCollectionEntry> = new Map();
    private enemyCollection: Map<string, EnemyCollectionEntry> = new Map();
    private achievements: Map<string, AchievementCollectionEntry> = new Map();
    
    // 初始化图鉴
    constructor() {
        this.initializeCardCollection();
        this.initializeEnemyCollection();
        this.initializeAchievements();
    }
    
    // 初始化卡牌图鉴
    private initializeCardCollection() {
        const allCards = getAllCards();
        allCards.forEach(card => {
            this.cardCollection.set(card.id, {
                cardId: card.id,
                owned: false,
                starLevel: 0,
                affinityLevel: 0,
                storyUnlocked: [false, false, false]
            });
        });
    }
    
    // 初始化敌人图鉴
    private initializeEnemyCollection() {
        const enemies: { id: string; name: string; description: string }[] = [
            { id: 'slime', name: '史莱姆', description: '最弱小的魔物，但数量众多。' },
            { id: 'skeleton', name: '骷髅兵', description: '被遗弃在战场上的士兵遗骸，被记忆碎片驱动。' },
            { id: 'wolf', name: '遗忘之狼', description: '失去主人的野狼，在废墟中游荡。' },
            { id: 'ghost', name: '记忆残影', description: '无法安息的灵魂碎片，会攻击生者。' },
            { id: 'golem', name: '岩石傀儡', description: '被魔法赋予生命的石头构造体。' },
            { id: 'dark_knight', name: '暗黑骑士', description: '堕落的骑士，被黑暗力量侵蚀。' },
            { id: 'dragon', name: '记忆龙', description: '古老的龙族，守护着失落的记忆。' },
            { id: 'shadow', name: '暗影', description: '纯粹的黑暗具象化，极其危险。' }
        ];
        
        enemies.forEach(enemy => {
            this.enemyCollection.set(enemy.id, {
                enemyId: enemy.id,
                name: enemy.name,
                encountered: false,
                defeated: false,
                defeatCount: 0,
                description: enemy.description
            });
        });
    }
    
    // 初始化成就图鉴
    private initializeAchievements() {
        const achievementList: { id: string; name: string; description: string; maxProgress: number }[] = [
            { id: 'first_blood', name: '初战告捷', description: '完成第一场战斗', maxProgress: 1 },
            { id: 'collector', name: '收集者', description: '收集10张不同的卡牌', maxProgress: 10 },
            { id: 'card_master', name: '卡牌大师', description: '收集50张不同的卡牌', maxProgress: 50 },
            { id: 'level_up', name: '成长之路', description: '将一张卡牌升到满级', maxProgress: 1 },
            { id: 'awaken', name: '觉醒时刻', description: '觉醒一张卡牌', maxProgress: 1 },
            { id: 'dungeon_clear', name: '地下城探险家', description: '通关任意副本10次', maxProgress: 10 },
            { id: 'tower_climber', name: '爬塔者', description: '到达爬塔第50层', maxProgress: 50 },
            { id: 'arena_warrior', name: '竞技场勇士', description: '在竞技场获胜10次', maxProgress: 10 },
            { id: 'rich', name: '富可敌国', description: '累计获得100万金币', maxProgress: 1000000 },
            { id: 'gacha_addict', name: '召唤狂', description: '进行100次召唤', maxProgress: 100 },
            { id: 'bond', name: '羁绊之力', description: '激活10组羁绊效果', maxProgress: 10 },
            { id: 'set_collector', name: '套装收集者', description: '收集12套完整的装备套装', maxProgress: 12 },
            { id: 'guild_contributor', name: '公会贡献者', description: '累计捐献10000公会贡献', maxProgress: 10000 },
            { id: 'trial_conqueror', name: '试炼征服者', description: '通关所有无尽试炼', maxProgress: 5 },
            { id: 'story_complete', name: '故事的终结', description: '通关主线剧情', maxProgress: 1 }
        ];
        
        achievementList.forEach(ach => {
            this.achievements.set(ach.id, {
                achievementId: ach.id,
                name: ach.name,
                description: ach.description,
                completed: false,
                progress: 0,
                maxProgress: ach.maxProgress
            });
        });
    }
    
    // ===== 卡牌图鉴 =====
    
    // 获得新卡牌
    public obtainCard(cardId: string): void {
        const entry = this.cardCollection.get(cardId);
        if (entry && !entry.owned) {
            entry.owned = true;
            entry.obtainedAt = Date.now();
            entry.starLevel = 1;
        }
    }
    
    // 提升卡牌收集度
    public upgradeCardStarLevel(cardId: string): void {
        const entry = this.cardCollection.get(cardId);
        if (entry && entry.owned && entry.starLevel < 5) {
            entry.starLevel++;
        }
    }
    
    // 解锁剧情
    public unlockStory(cardId: string, storyIndex: number): void {
        const entry = this.cardCollection.get(cardId);
        if (entry && storyIndex >= 0 && storyIndex < 3) {
            entry.storyUnlocked[storyIndex] = true;
        }
    }
    
    // 获取卡牌收集进度
    public getCardCollectionProgress(): {
        total: number;
        collected: number;
        percentage: number;
    } {
        const total = this.cardCollection.size;
        const collected = Array.from(this.cardCollection.values()).filter(e => e.owned).length;
        return {
            total,
            collected,
            percentage: Math.floor((collected / total) * 100)
        };
    }
    
    // 获取已收集的卡牌
    public getCollectedCards(): CardCollectionEntry[] {
        return Array.from(this.cardCollection.values()).filter(e => e.owned);
    }
    
    // ===== 敌人图鉴 =====
    
    // 遭遇敌人
    public encounterEnemy(enemyId: string): void {
        const entry = this.enemyCollection.get(enemyId);
        if (entry && !entry.encountered) {
            entry.encountered = true;
            entry.firstEncounterAt = Date.now();
        }
    }
    
    // 击败敌人
    public defeatEnemy(enemyId: string): void {
        const entry = this.enemyCollection.get(enemyId);
        if (entry) {
            entry.encountered = true;
            entry.defeated = true;
            entry.defeatCount++;
        }
    }
    
    // 获取敌人图鉴列表
    public getEnemyCollection(): EnemyCollectionEntry[] {
        return Array.from(this.enemyCollection.values());
    }
    
    // ===== 成就系统 =====
    
    // 更新成就进度
    public updateAchievementProgress(achievementId: string, progress: number): {
        completed: boolean;
        firstTime?: boolean;
    } {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.completed) {
            return { completed: achievement?.completed || false };
        }
        
        achievement.progress = Math.min(progress, achievement.maxProgress);
        
        if (achievement.progress >= achievement.maxProgress) {
            achievement.completed = true;
            achievement.completedAt = Date.now();
            return { completed: true, firstTime: true };
        }
        
        return { completed: false };
    }
    
    // 增加成就进度
    public addAchievementProgress(achievementId: string, amount: number = 1): {
        completed: boolean;
        firstTime?: boolean;
    } {
        const achievement = this.achievements.get(achievementId);
        if (!achievement) return { completed: false };
        
        return this.updateAchievementProgress(achievementId, achievement.progress + amount);
    }
    
    // 获取成就列表
    public getAchievements(): AchievementCollectionEntry[] {
        return Array.from(this.achievements.values());
    }
    
    // 获取已完成成就
    public getCompletedAchievements(): AchievementCollectionEntry[] {
        return Array.from(this.achievements.values()).filter(a => a.completed);
    }
    
    // 获取成就统计
    public getAchievementStats(): {
        total: number;
        completed: number;
        completionRate: number;
    } {
        const total = this.achievements.size;
        const completed = this.getCompletedAchievements().length;
        return {
            total,
            completed,
            completionRate: Math.floor((completed / total) * 100)
        };
    }
    
    // ===== 图鉴总览 =====
    
    public getCollectionOverview(): {
        cardProgress: { total: number; collected: number };
        enemyProgress: { total: number; encountered: number; defeated: number };
        achievementProgress: { total: number; completed: number };
    } {
        const cards = this.getCardCollectionProgress();
        const enemies = this.getEnemyCollection();
        const achievements = this.getAchievementStats();
        
        return {
            cardProgress: { total: cards.total, collected: cards.collected },
            enemyProgress: {
                total: enemies.length,
                encountered: enemies.filter(e => e.encountered).length,
                defeated: enemies.filter(e => e.defeated).length
            },
            achievementProgress: { total: achievements.total, completed: achievements.completed }
        };
    }
}

// 单例
export const collectionSystem = new CollectionSystem();
