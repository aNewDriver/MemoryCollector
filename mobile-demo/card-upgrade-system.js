/**
 * 卡牌升级系统 - Mobile Demo版本
 * 参考：杀戮尖塔的卡牌升级机制
 */

const UpgradeType = {
    INCREASE_DAMAGE: 'increase_damage',
    INCREASE_HEAL: 'increase_heal',
    INCREASE_SHIELD: 'increase_shield',
    REDUCE_COST: 'reduce_cost',
    REMOVE_COST: 'remove_cost',
    ADD_DRAW: 'add_draw',
    ADD_ENERGY: 'add_energy',
    ADD_EFFECT: 'add_effect',
    ENHANCE_EFFECT: 'enhance_effect',
    ADD_ELEMENT: 'add_element',
    ADD_KEYWORD: 'add_keyword',
    CHANGE_TARGET: 'change_target',
    ADD_CHAIN: 'add_chain'
};

const CardKeyword = {
    QUICK: 'quick',
    COMBO: 'combo',
    CHAIN: 'chain',
    ECHO: 'echo',
    VAMPIRE: 'vampire',
    PIERCE: 'pierce',
    LETHAL: 'lethal'
};

const RARITY = { N: 1, R: 2, SR: 3, SSR: 4, UR: 5 };

const UPGRADE_DATABASE = [
    // 伤害提升
    {
        id: 'upgrade_damage_plus2',
        name: '锋利强化',
        description: '伤害+2',
        effect: { type: UpgradeType.INCREASE_DAMAGE, value: 2, description: '伤害+2' },
        cost: { gold: 50, memoryShards: 5 }
    },
    {
        id: 'upgrade_damage_plus5',
        name: '致命锋芒',
        description: '伤害+5',
        effect: { type: UpgradeType.INCREASE_DAMAGE, value: 5, description: '伤害+5' },
        cost: { gold: 150, memoryShards: 15 },
        requirements: { rarityLimit: RARITY.R }
    },
    // 治疗提升
    {
        id: 'upgrade_heal_plus2',
        name: '治愈强化',
        description: '治疗量+2',
        effect: { type: UpgradeType.INCREASE_HEAL, value: 2, description: '治疗+2' },
        cost: { gold: 40, memoryShards: 4 }
    },
    {
        id: 'upgrade_heal_plus5',
        name: '生命涌动',
        description: '治疗量+5',
        effect: { type: UpgradeType.INCREASE_HEAL, value: 5, description: '治疗+5' },
        cost: { gold: 120, memoryShards: 12 },
        requirements: { rarityLimit: RARITY.R }
    },
    // 护盾提升
    {
        id: 'upgrade_shield_plus2',
        name: '护甲强化',
        description: '护盾值+2',
        effect: { type: UpgradeType.INCREASE_SHIELD, value: 2, description: '护盾+2' },
        cost: { gold: 45, memoryShards: 4 }
    },
    {
        id: 'upgrade_shield_plus5',
        name: '坚不可摧',
        description: '护盾值+5',
        effect: { type: UpgradeType.INCREASE_SHIELD, value: 5, description: '护盾+5' },
        cost: { gold: 130, memoryShards: 13 },
        requirements: { rarityLimit: RARITY.R }
    },
    // 费用优化
    {
        id: 'upgrade_cost_minus1',
        name: '精简施法',
        description: '费用-1',
        effect: { type: UpgradeType.REDUCE_COST, value: 1, description: '费用-1' },
        cost: { gold: 100, memoryShards: 10 },
        requirements: { rarityLimit: RARITY.R, maxUpgrades: 2 }
    },
    {
        id: 'upgrade_cost_zero',
        name: '零费施法',
        description: '费用变为0',
        effect: { type: UpgradeType.REMOVE_COST, value: 0, description: '变为0费' },
        cost: { gold: 300, memoryShards: 30, materials: { 'void_essence': 1 } },
        requirements: { rarityLimit: RARITY.SR, maxUpgrades: 1 }
    },
    // 抽牌效果
    {
        id: 'upgrade_draw_plus1',
        name: '灵感涌现',
        description: '抽牌+1',
        effect: { type: UpgradeType.ADD_DRAW, value: 1, description: '额外抽1张' },
        cost: { gold: 80, memoryShards: 8 },
        requirements: { maxUpgrades: 2 }
    },
    // 能量效果
    {
        id: 'upgrade_energy_plus1',
        name: '能量充盈',
        description: '获得能量+1',
        effect: { type: UpgradeType.ADD_ENERGY, value: 1, description: '额外+1能量' },
        cost: { gold: 120, memoryShards: 12 },
        requirements: { rarityLimit: RARITY.R, maxUpgrades: 1 }
    },
    // 关键词添加
    {
        id: 'upgrade_keyword_quick',
        name: '瞬发符文',
        description: '添加"瞬发"关键词',
        effect: { type: UpgradeType.ADD_KEYWORD, value: 1, description: '获得瞬发' },
        cost: { gold: 200, memoryShards: 20, materials: { 'wind_crystal': 2 } },
        requirements: { rarityLimit: RARITY.SR, maxUpgrades: 1 }
    },
    {
        id: 'upgrade_keyword_combo',
        name: '连击符文',
        description: '添加"连击"关键词（打出后抽1张）',
        effect: { type: UpgradeType.ADD_KEYWORD, value: 1, description: '获得连击' },
        cost: { gold: 180, memoryShards: 18, materials: { 'flowing_water': 2 } },
        requirements: { rarityLimit: RARITY.SR, maxUpgrades: 1 }
    },
    {
        id: 'upgrade_keyword_vampire',
        name: '吸血符文',
        description: '添加"吸血"关键词',
        effect: { type: UpgradeType.ADD_KEYWORD, value: 1, description: '获得吸血' },
        cost: { gold: 220, memoryShards: 22, materials: { 'blood_stone': 2 } },
        requirements: { rarityLimit: RARITY.SR, maxUpgrades: 1 }
    },
    // 元素附加
    {
        id: 'upgrade_element_fire',
        name: '火焰附魔',
        description: '添加火属性',
        effect: { type: UpgradeType.ADD_ELEMENT, value: 1, description: '附加火元素' },
        cost: { gold: 150, memoryShards: 15, materials: { 'fire_essence': 3 } },
        requirements: { maxUpgrades: 1 }
    },
    {
        id: 'upgrade_element_ice',
        name: '寒冰附魔',
        description: '添加水属性',
        effect: { type: UpgradeType.ADD_ELEMENT, value: 1, description: '附加水元素' },
        cost: { gold: 150, memoryShards: 15, materials: { 'ice_crystal': 3 } },
        requirements: { maxUpgrades: 1 }
    },
    // 特殊升级
    {
        id: 'upgrade_chain_effect',
        name: '连锁强化',
        description: '添加连锁效果（打出后下张同元素牌伤害+50%）',
        effect: { type: UpgradeType.ADD_CHAIN, value: 0.5, description: '获得连锁' },
        cost: { gold: 250, memoryShards: 25, materials: { 'chain_stone': 1 } },
        requirements: { rarityLimit: RARITY.SSR, maxUpgrades: 1 }
    },
    {
        id: 'upgrade_pierce',
        name: '穿透强化',
        description: '伤害无视护盾',
        effect: { type: UpgradeType.ADD_KEYWORD, value: 1, description: '获得穿透' },
        cost: { gold: 280, memoryShards: 28, materials: { 'void_steel': 2 } },
        requirements: { rarityLimit: RARITY.SSR, maxUpgrades: 1 }
    }
];

class CardUpgradeManager {
    constructor() {
        this.upgradedCards = new Map();
        this.totalUpgradeCount = 0;
    }

    getUpgradeData(upgradeId) {
        return UPGRADE_DATABASE.find(u => u.id === upgradeId);
    }

    canUpgrade(cardInstanceId, upgradeId, cardData) {
        const upgrade = this.getUpgradeData(upgradeId);
        if (!upgrade) return false;

        const instance = this.upgradedCards.get(cardInstanceId);
        const currentUpgrades = instance?.upgradeIds || [];

        if (upgrade.requirements?.maxUpgrades) {
            const sameTypeUpgrades = currentUpgrades.filter(id => 
                this.getUpgradeData(id)?.effect.type === upgrade.effect.type
            ).length;
            if (sameTypeUpgrades >= upgrade.requirements.maxUpgrades) return false;
        }

        if (upgrade.requirements?.rarityLimit !== undefined) {
            if (cardData.rarity < upgrade.requirements.rarityLimit) return false;
        }

        if (upgrade.requirements?.elementRestriction) {
            if (cardData.element !== upgrade.requirements.elementRestriction) return false;
        }

        return true;
    }

    upgradeCard(cardInstanceId, upgradeId, cardData) {
        if (!this.canUpgrade(cardInstanceId, upgradeId, cardData)) return false;

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

    getCardUpgrades(cardInstanceId) {
        return this.upgradedCards.get(cardInstanceId);
    }

    getCardUpgradeEffects(cardInstanceId) {
        const instance = this.upgradedCards.get(cardInstanceId);
        if (!instance) return [];
        return instance.upgradeIds.map(id => this.getUpgradeData(id)?.effect).filter(effect => effect !== undefined);
    }

    calculateUpgradedStats(baseStats, cardInstanceId) {
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

    getAvailableUpgrades(cardData, cardInstanceId) {
        return UPGRADE_DATABASE.filter(upgrade => this.canUpgrade(cardInstanceId, upgrade.id, cardData));
    }

    getUpgradeStats() {
        const upgradesByType = {};

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

    reset() {
        this.upgradedCards.clear();
        this.totalUpgradeCount = 0;
    }

    exportSaveData() {
        return Array.from(this.upgradedCards.values());
    }

    importSaveData(data) {
        this.upgradedCards.clear();
        this.totalUpgradeCount = 0;
        for (const instance of data) {
            this.upgradedCards.set(instance.cardInstanceId, instance);
            this.totalUpgradeCount += instance.upgradeCount;
        }
    }
}

// 导出到全局
window.UpgradeType = UpgradeType;
window.CardKeyword = CardKeyword;
window.UPGRADE_DATABASE = UPGRADE_DATABASE;
window.CardUpgradeManager = CardUpgradeManager;
window.cardUpgradeManager = new CardUpgradeManager();
