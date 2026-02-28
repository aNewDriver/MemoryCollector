/**
 * 养成系统
 * 处理卡牌升级、突破、觉醒、技能升级等
 */

import { CardInstance, CardData, getCardData } from '../data/CardData';

// 升级配置
export const LEVEL_CONFIG = {
    maxLevel: 100,
    maxAscension: 5,  // 突破次数
    
    // 每级所需经验（曲线增长）
    getExpRequired: (level: number): number => {
        return Math.floor(100 * Math.pow(1.05, level));
    },
    
    // 突破所需等级
    ascensionLevels: [20, 40, 60, 80, 100],
    
    // 突破后的等级上限
    getLevelCap: (ascension: number): number => {
        return (ascension + 1) * 20;
    }
};

// 亲密度配置
export const AFFINITY_CONFIG = {
    maxLevel: 10,
    getExpRequired: (level: number): number => {
        return level * 100;
    }
};

// 技能升级消耗
export const SKILL_CONFIG = {
    maxLevel: 5,
    getCost: (currentLevel: number): SkillCost => {
        return {
            gold: currentLevel * 1000,
            material: currentLevel >= 3 ? 'skill_book_advanced' : 'skill_book_basic',
            materialCount: currentLevel
        };
    }
};

interface SkillCost {
    gold: number;
    material: string;
    materialCount: number;
}

// 资源管理器
export class ResourceManager {
    private resources: Map<string, number> = new Map();
    
    public addResource(type: string, amount: number): void {
        const current = this.resources.get(type) || 0;
        this.resources.set(type, current + amount);
    }
    
    public consumeResource(type: string, amount: number): boolean {
        const current = this.resources.get(type) || 0;
        if (current < amount) return false;
        this.resources.set(type, current - amount);
        return true;
    }
    
    public getResource(type: string): number {
        return this.resources.get(type) || 0;
    }
}

// 养成管理器
export class GrowthManager {
    private resourceManager: ResourceManager;
    
    constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
    }
    
    // ============ 等级系统 ============
    
    // 添加经验
    public addExp(card: CardInstance, exp: number): boolean {
        const cardData = getCardData(card.cardId);
        if (!cardData) return false;
        
        // 检查是否达到当前突破上限
        const levelCap = LEVEL_CONFIG.getLevelCap(card.ascension);
        if (card.level >= levelCap && card.level >= LEVEL_CONFIG.maxLevel) {
            return false;  // 已达上限
        }
        
        card.exp += exp;
        
        // 尝试升级
        while (card.level < levelCap && card.level < LEVEL_CONFIG.maxLevel) {
            const expRequired = LEVEL_CONFIG.getExpRequired(card.level);
            if (card.exp >= expRequired) {
                card.exp -= expRequired;
                card.level++;
                this.onLevelUp(card, cardData);
            } else {
                break;
            }
        }
        
        // 重新计算当前属性
        this.recalculateStats(card, cardData);
        return true;
    }
    
    private onLevelUp(card: CardInstance, cardData: CardData): void {
        // 升级事件，可以触发特效、解锁功能等
        console.log(`${cardData.name} 升级到 ${card.level} 级！`);
    }
    
    // 突破
    public ascend(card: CardInstance): boolean {
        const cardData = getCardData(card.cardId);
        if (!cardData) return false;
        
        // 检查条件
        if (card.ascension >= LEVEL_CONFIG.maxAscension) return false;
        const requiredLevel = LEVEL_CONFIG.ascensionLevels[card.ascension];
        if (card.level < requiredLevel) return false;
        
        // 检查资源
        const cost = this.getAscensionCost(card.ascension);
        for (const [resource, amount] of Object.entries(cost)) {
            if (!this.resourceManager.consumeResource(resource, amount)) {
                return false;
            }
        }
        
        // 执行突破
        card.ascension++;
        
        // 突破后属性大幅提升
        this.recalculateStats(card, cardData);
        
        return true;
    }
    
    private getAscensionCost(ascension: number): Record<string, number> {
        const baseCost = {
            'ascension_stone': (ascension + 1) * 10,
            'gold': (ascension + 1) * 50000
        };
        
        // 高突破需要额外材料
        if (ascension >= 3) {
            baseCost['ascension_core'] = ascension - 2;
        }
        
        return baseCost;
    }
    
    // ============ 技能升级 ============
    
    public upgradeSkill(card: CardInstance, skillType: 'normal' | 'special' | 'passive'): boolean {
        const cardData = getCardData(card.cardId);
        if (!cardData) return false;
        
        const currentLevel = card.skillLevels[skillType];
        if (currentLevel >= SKILL_CONFIG.maxLevel) return false;
        
        const cost = SKILL_CONFIG.getCost(currentLevel);
        
        // 检查金币
        if (!this.resourceManager.consumeResource('gold', cost.gold)) {
            return false;
        }
        
        // 检查材料
        if (!this.resourceManager.consumeResource(cost.material, cost.materialCount)) {
            // 回滚金币
            this.resourceManager.addResource('gold', cost.gold);
            return false;
        }
        
        card.skillLevels[skillType]++;
        return true;
    }
    
    // ============ 亲密度系统 ============
    
    public addAffinity(card: CardInstance, exp: number): boolean {
        if (card.affinityLevel >= AFFINITY_CONFIG.maxLevel) return false;
        
        card.affinity += exp;
        
        while (card.affinityLevel < AFFINITY_CONFIG.maxLevel) {
            const expRequired = AFFINITY_CONFIG.getExpRequired(card.affinityLevel);
            if (card.affinity >= expRequired) {
                card.affinity -= expRequired;
                card.affinityLevel++;
                this.onAffinityLevelUp(card);
            } else {
                break;
            }
        }
        
        return true;
    }
    
    private onAffinityLevelUp(card: CardInstance): void {
        // 解锁新剧情、提升被动效果等
        const cardData = getCardData(card.cardId);
        console.log(`${cardData?.name} 亲密度提升到 ${card.affinityLevel} 级！`);
        
        // 解锁记忆剧情
        // TODO: 触发剧情解锁事件
    }
    
    // ============ 觉醒系统 ============
    
    public canAwaken(card: CardInstance): boolean {
        if (card.awakened) return false;
        if (card.level < LEVEL_CONFIG.maxLevel) return false;
        if (card.ascension < LEVEL_CONFIG.maxAscension) return false;
        if (card.affinityLevel < 5) return false;  // 需要一定亲密度
        
        // 需要特定觉醒材料
        return this.resourceManager.getResource('awakening_crystal') >= 50;
    }
    
    public awaken(card: CardInstance): boolean {
        if (!this.canAwaken(card)) return false;
        
        if (!this.resourceManager.consumeResource('awakening_crystal', 50)) {
            return false;
        }
        
        card.awakened = true;
        
        const cardData = getCardData(card.cardId);
        this.recalculateStats(card, cardData!);
        
        console.log(`${cardData?.name} 觉醒了！`);
        return true;
    }
    
    // ============ 属性计算 ============
    
    private recalculateStats(card: CardInstance, cardData: CardData): void {
        const base = cardData.baseStats;
        const growth = cardData.growth;
        
        // 基础属性 = 初始值 + 成长 * (等级-1)
        let hp = base.hp + growth.hp * (card.level - 1);
        let atk = base.atk + growth.atk * (card.level - 1);
        let def = base.def + growth.def * (card.level - 1);
        let spd = base.spd + growth.spd * (card.level - 1);
        
        // 突破加成（每次突破提升20%）
        const ascensionMultiplier = 1 + card.ascension * 0.2;
        hp *= ascensionMultiplier;
        atk *= ascensionMultiplier;
        def *= ascensionMultiplier;
        
        // 觉醒加成（50%提升）
        if (card.awakened) {
            const awakenMultiplier = 1.5;
            hp *= awakenMultiplier;
            atk *= awakenMultiplier;
            def *= awakenMultiplier;
            spd *= 1.2;
        }
        
        // 亲密度加成（每级1%）
        const affinityMultiplier = 1 + card.affinityLevel * 0.01;
        hp *= affinityMultiplier;
        atk *= affinityMultiplier;
        def *= affinityMultiplier;
        
        card.currentStats = {
            hp: Math.floor(hp),
            atk: Math.floor(atk),
            def: Math.floor(def),
            spd: Math.floor(spd),
            crt: base.crt,
            cdmg: base.cdmg,
            acc: base.acc,
            res: base.res
        };
    }
}
