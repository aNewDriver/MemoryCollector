/**
 * 卡牌升级系统
 * 参考：杀戮尖塔的卡牌升级机制
 * 核心玩法：在休息处升级卡牌，提升效果/降低费用
 */

import { CardData, Rarity } from '../data/CardData';

export interface CardUpgrade {
    id: string;
    name: string;
    description: string;
    effect: UpgradeEffect;
    // 升级费用
    cost: {
        gold?: number;
        memoryShards?: number;
        materials?: { [materialId: string]: number };
    };
    // 升级限制
    requirements?: {
        maxUpgrades?: number;        // 最大升级次数
        rarityLimit?: Rarity;        // 稀有度限制
        elementRestriction?: string; // 元素限制
    };
}

export interface UpgradeEffect {
    type: UpgradeType;
    value: number;
    description: string;
}

export enum UpgradeType {
    // 数值提升
    INCREASE_DAMAGE = 'increase_damage',       // 增加伤害
    INCREASE_HEAL = 'increase_heal',           // 增加治疗
    INCREASE_SHIELD = 'increase_shield',       // 增加护盾
    
    // 费用优化
    REDUCE_COST = 'reduce_cost',               // 减少费用
    REMOVE_COST = 'remove_cost',               // 移除费用（变为0费）
    
    // 效果增强
    ADD_DRAW = 'add_draw',                     // 增加抽牌
    ADD_ENERGY = 'add_energy',                 // 增加能量
    ADD_EFFECT = 'add_effect',                 // 添加新效果
    ENHANCE_EFFECT = 'enhance_effect',         // 增强现有效果
    
    // 特殊升级
    ADD_ELEMENT = 'add_element',               // 添加元素属性
    ADD_KEYWORD = 'add_keyword',               // 添加关键词（如"连击"、"瞬发"）
    CHANGE_TARGET = 'change_target',           // 改变目标
    ADD_CHAIN = 'add_chain'                    // 添加连锁效果
}

// 升级关键词
export enum CardKeyword {
    QUICK = 'quick',           // 瞬发：不消耗行动
    COMBO = 'combo',           // 连击：打出后抽1张
    CHAIN = 'chain',           // 连锁：可以连续打出
    ECHO = 'echo',             // 回响：洗牌时回到手牌
    VAMPIRE = 'vampire',       // 吸血：造成伤害时恢复生命
    PIERCE = 'pierce',         // 穿透：无视护盾
    LETHAL = 'lethal'          // 致命：对生命低于30%的敌人伤害翻倍
}

// 卡牌升级实例
export interface CardUpgradeInstance {
    cardInstanceId: string;
    upgradeIds: string[];     // 已应用的升级ID列表
    upgradeCount: number;     // 升级次数
    upgradedAt: number[];     // 每次升级的时间戳
}

/**
 * 升级数据库
 */
export const UPGRADE_DATABASE: CardUpgrade[] = [
    // ========== 伤害提升 ==========
    {
        id: 'upgrade_damage_plus2',
        name: '锋利强化',
        description: '伤害+2',
        effect: {
            type: UpgradeType.INCREASE_DAMAGE,
            value: 2,
            description: '伤害+2'
        },
        cost: { gold: 50, memoryShards: 5 }
    },
    {
        id: 'upgrade_damage_plus5',
        name: '致命锋芒',
        description: '伤害+5',
        effect: {
            type: UpgradeType.INCREASE_DAMAGE,
            value: 5,
            description: '伤害+5'
        },
        cost: { gold: 150, memoryShards: 15 },
        requirements: { rarityLimit: Rarity.BLUE }
    },
    
    // ========== 治疗提升 ==========
    {
        id: 'upgrade_heal_plus2',
        name: '治愈强化',
        description: '治疗量+2',
        effect: {
            type: UpgradeType.INCREASE_HEAL,
            value: 2,
            description: '治疗+2'
        },
        cost: { gold: 40, memoryShards: 4 }
    },
    {
        id: 'upgrade_heal_plus5',
        name: '生命涌动',
        description: '治疗量+5',
        effect: {
            type: UpgradeType.INCREASE_HEAL,
            value: 5,
            description: '治疗+5'
        },
        cost: { gold: 120, memoryShards: 12 },
        requirements: { rarityLimit: Rarity.BLUE }
    },
    
    // ========== 护盾提升 ==========
    {
        id: 'upgrade_shield_plus2',
        name: '护甲强化',
        description: '护盾值+2',
        effect: {
            type: UpgradeType.INCREASE_SHIELD,
            value: 2,
            description: '护盾+2'
        },
        cost: { gold: 45, memoryShards: 4 }
    },
    {
        id: 'upgrade_shield_plus5',
        name: '坚不可摧',
        description: '护盾值+5',
        effect: {
            type: UpgradeType.INCREASE_SHIELD,
            value: 5,
            description: '护盾+5'
        },
        cost: { gold: 130, memoryShards: 13 },
        requirements: { rarityLimit: Rarity.BLUE }
    },
    
    // ========== 费用优化 ==========
    {
        id: 'upgrade_cost_minus1',
        name: '精简施法',
        description: '费用-1',
        effect: {
            type: UpgradeType.REDUCE_COST,
            value: 1,
            description: '费用-1'
        },
        cost: { gold: 100, memoryShards: 10 },
        requirements: { rarityLimit: Rarity.BLUE, maxUpgrades: 2 }
    },
    {
        id: 'upgrade_cost_zero',
        name: '零费施法',
        description: '费用变为0',
        effect: {
            type: UpgradeType.REMOVE_COST,
            value: 0,
            description: '变为0费'
        },
        cost: { gold: 300, memoryShards: 30, materials: { 'void_essence': 1 } },
        requirements: { rarityLimit: Rarity.PURPLE, maxUpgrades: 1 }
    },
    
    // ========== 抽牌效果 ==========
    {
        id: 'upgrade_draw_plus1',
        name: '灵感涌现',
        description: '抽牌+1',
        effect: {
            type: UpgradeType.ADD_DRAW,
            value: 1,
            description: '额外抽1张'
        },
        cost: { gold: 80, memoryShards: 8 },
        requirements: { maxUpgrades: 2 }
    },
    
    // ========== 能量效果 ==========
    {
        id: 'upgrade_energy_plus1',
        name: '能量充盈',
        description: '获得能量+1',
        effect: {
            type: UpgradeType.ADD_ENERGY,
            value: 1,
            description: '额外+1能量'
        },
        cost: { gold: 120, memoryShards: 12 },
        requirements: { rarityLimit: Rarity.BLUE, maxUpgrades: 1 }
    },
    
    // ========== 关键词添加 ==========
    {
        id: 'upgrade_keyword_quick',
        name: '瞬发符文',
        description: '添加"瞬发"关键词',
        effect: {
            type: UpgradeType.ADD_KEYWORD,
            value: 1,
            description: '获得瞬发'
        },
        cost: { gold: 200, memoryShards: 20, materials: { 'wind_crystal': 2 } },
        requirements: { rarityLimit: Rarity.PURPLE, maxUpgrades: 1 }
    },
    {
        id: 'upgrade_keyword_combo',
        name: '连击符文',
        description: '添加"连击"关键词（打出后抽1张）',
        effect: {
            type: UpgradeType.ADD_KEYWORD,
            value: 1,
            description: '获得连击'
        },
        cost: { gold: 180, memoryShards: 18, materials: { 'flowing_water': 2 } },
        requirements: { rarityLimit: Rarity.PURPLE, maxUpgrades: 1 }
    },
    {
        id: 'upgrade_keyword_vampire',
        name: '吸血符文',
        description: '添加"吸血"关键词',
        effect: {
            type: UpgradeType.ADD_KEYWORD,
            value: 1,
            description: '获得吸血'
        },
        cost: { gold: 220, memoryShards: 22, materials: { 'blood_stone': 2 } },
        requirements: { rarityLimit: Rarity.PURPLE, maxUpgrades: 1 }
    },
    
    // ========== 元素附加 ==========
    {
        id: 'upgrade_element_fire',
        name: '火焰附魔',
        description: '添加火属性',
        effect: {
            type: UpgradeType.ADD_ELEMENT,
            value: 1,
            description: '附加火元素'
        },
        cost: { gold: 150, memoryShards: 15, materials: { 'fire_essence': 3 } },
        requirements: { maxUpgrades: 1 }
    },
    {
        id: 'upgrade_element_ice',
        name: '寒冰附魔',
        description: '添加水属性',
        effect: {
            type: UpgradeType.ADD_ELEMENT,
            value: 1,
            description: '附加水元素'
        },
        cost: { gold: 150, memoryShards: 15, materials: { 'ice_crystal': 3 } },
        requirements: { maxUpgrades: 1 }
    },
    
    // ========== 特殊升级 ==========
    {
        id: 'upgrade_chain_effect',
        name: '连锁强化',
        description: '添加连锁效果（打出后下张同元素牌伤害+50%）',
        effect: {
            type: UpgradeType.ADD_CHAIN,
            value: 0.5,
            description: '获得连锁'
        },
        cost: { gold: 250, memoryShards: 25, materials: { 'chain_stone': 1 } },
        requirements: { rarityLimit: Rarity.GOLD, maxUpgrades: 1 }
    },
    {
        id: 'upgrade_pierce',
        name: '穿透强化',
        description: '伤害无视护盾',
        effect: {
            type: UpgradeType.ADD_KEYWORD,
            value: 1,
            description: '获得穿透'
        },
        cost: { gold: 280, memoryShards: 28, materials: { 'void_steel': 2 } },
        requirements: { rarityLimit: Rarity.GOLD, maxUpgrades: 1 }
    }
];

/**
 * 卡牌升级管理器
 */
export class CardUpgradeManager {
    private upgradedCards: Map<string, CardUpgradeInstance> = new Map();
    private totalUpgradeCount: number = 0;

    /**
     * 获取升级数据
     */
    getUpgradeData(upgradeId: string): CardUpgrade | undefined {
        return UPGRADE_DATABASE.find(u => u.id === upgradeId);
    }

    /**
     * 检查卡牌是否可以升级
     */
    canUpgrade(cardInstanceId: string, upgradeId: string, cardData: CardData): boolean {
        const upgrade = this.getUpgradeData(upgradeId);
        if (!upgrade) return false;

        const instance = this.upgradedCards.get(cardInstanceId);
        const currentUpgrades = instance?.upgradeIds || [];

        // 检查升级次数限制
        if (upgrade.requirements?.maxUpgrades) {
            const sameTypeUpgrades = currentUpgrades.filter(id => 
                this.getUpgradeData(id)?.effect.type === upgrade.effect.type
            ).length;
            if (sameTypeUpgrades >= upgrade.requirements.maxUpgrades) {
                return false;
            }
        }

        // 检查稀有度限制
        if (upgrade.requirements?.rarityLimit !== undefined) {
            if (cardData.rarity < upgrade.requirements.rarityLimit) {
                return false;
            }
        }

        // 检查元素限制
        if (upgrade.requirements?.elementRestriction) {
            if (cardData.element !== upgrade.requirements.elementRestriction) {
                return false;
            }
        }

        return true;
    }

    /**
     * 升级卡牌
     */
    upgradeCard(cardInstanceId: string, upgradeId: string, cardData: CardData): boolean {
        if (!this.canUpgrade(cardInstanceId, upgradeId, cardData)) {
            return false;
        }

        let instance = this.upgradedCards.get(cardInstanceId);
        if (!instance) {
            instance = {
                cardInstanceId,
                upgradeIds: [],
                upgradeCount: 0,
                upgradedAt: []
            };
            this.upgradedCards.set(cardInstanceId, instance);
        }

        instance.upgradeIds.push(upgradeId);
        instance.upgradeCount++;
        instance.upgradedAt.push(Date.now());
        this.totalUpgradeCount++;

        return true;
    }

    /**
     * 获取卡牌的升级实例
     */
    getCardUpgrades(cardInstanceId: string): CardUpgradeInstance | undefined {
        return this.upgradedCards.get(cardInstanceId);
    }

    /**
     * 获取卡牌的所有升级效果
     */
    getCardUpgradeEffects(cardInstanceId: string): UpgradeEffect[] {
        const instance = this.upgradedCards.get(cardInstanceId);
        if (!instance) return [];

        return instance.upgradeIds
            .map(id => this.getUpgradeData(id)?.effect)
            .filter((effect): effect is UpgradeEffect => effect !== undefined);
    }

    /**
     * 计算升级后的卡牌属性
     */
    calculateUpgradedStats(baseStats: any, cardInstanceId: string): any {
        const effects = this.getCardUpgradeEffects(cardInstanceId);
        const stats = { ...baseStats };

        for (const effect of effects) {
            switch (effect.type) {
                case UpgradeType.INCREASE_DAMAGE:
                    stats.damage = (stats.damage || 0) + effect.value;
                    break;
                case UpgradeType.INCREASE_HEAL:
                    stats.heal = (stats.heal || 0) + effect.value;
                    break;
                case UpgradeType.INCREASE_SHIELD:
                    stats.shield = (stats.shield || 0) + effect.value;
                    break;
                case UpgradeType.REDUCE_COST:
                    stats.cost = Math.max(0, (stats.cost || 0) - effect.value);
                    break;
                case UpgradeType.REMOVE_COST:
                    stats.cost = 0;
                    break;
                case UpgradeType.ADD_DRAW:
                    stats.draw = (stats.draw || 0) + effect.value;
                    break;
                case UpgradeType.ADD_ENERGY:
                    stats.energyGain = (stats.energyGain || 0) + effect.value;
                    break;
            }
        }

        return stats;
    }

    /**
     * 获取适合某张卡牌的可用升级
     */
    getAvailableUpgrades(cardData: CardData, cardInstanceId: string): CardUpgrade[] {
        return UPGRADE_DATABASE.filter(upgrade => 
            this.canUpgrade(cardInstanceId, upgrade.id, cardData)
        );
    }

    /**
     * 获取升级统计
     */
    getUpgradeStats(): {
        totalUpgrades: number;
        upgradedCards: number;
        upgradesByType: { [key: string]: number };
    } {
        const upgradesByType: { [key: string]: number } = {};

        for (const instance of this.upgradedCards.values()) {
            for (const upgradeId of instance.upgradeIds) {
                const upgrade = this.getUpgradeData(upgradeId);
                if (upgrade) {
                    const type = upgrade.effect.type;
                    upgradesByType[type] = (upgradesByType[type] || 0) + 1;
                }
            }
        }

        return {
            totalUpgrades: this.totalUpgradeCount,
            upgradedCards: this.upgradedCards.size,
            upgradesByType
        };
    }

    /**
     * 重置所有升级
     */
    reset(): void {
        this.upgradedCards.clear();
        this.totalUpgradeCount = 0;
    }

    /**
     * 导出存档数据
     */
    exportSaveData(): CardUpgradeInstance[] {
        return Array.from(this.upgradedCards.values());
    }

    /**
     * 导入存档数据
     */
    importSaveData(data: CardUpgradeInstance[]): void {
        this.upgradedCards.clear();
        this.totalUpgradeCount = 0;
        
        for (const instance of data) {
            this.upgradedCards.set(instance.cardInstanceId, instance);
            this.totalUpgradeCount += instance.upgradeCount;
        }
    }
}

// 导出单例
export const cardUpgradeManager = new CardUpgradeManager();
export { UPGRADE_DATABASE };
