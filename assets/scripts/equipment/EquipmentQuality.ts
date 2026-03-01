/**
 * 装备品质系统
 * 定义装备稀有度、品质等级和随机属性
 */

// 装备稀有度（决定基础属性范围）
export enum EquipmentRarity {
    COMMON = 1,      // 普通 - 白色
    UNCOMMON = 2,    // 优秀 - 绿色
    RARE = 3,        // 稀有 - 蓝色
    EPIC = 4,        // 史诗 - 紫色
    LEGENDARY = 5,   // 传说 - 金色
    MYTHIC = 6       // 神话 - 红色
}

// 装备品质等级（同稀有度内的细分）
export enum EquipmentQuality {
    D = 1,    // 劣质
    C = 2,    // 普通
    B = 3,    // 良好
    A = 4,    // 优秀
    S = 5,    // 完美
    SS = 6    // 传说
}

// 装备部位
export enum EquipmentSlot {
    WEAPON = 'weapon',       // 武器 - 攻击
    HELMET = 'helmet',       // 头盔 - 生命
    ARMOR = 'armor',         // 护甲 - 防御
    LEGS = 'legs',           // 护腿 - 生命/防御
    ACCESSORY = 'accessory', // 饰品 - 暴击/命中
    RING = 'ring'            // 戒指 - 速度/抵抗
}

// 装备主属性类型
export const MAIN_STAT_BY_SLOT: Record<EquipmentSlot, string[]> = {
    [EquipmentSlot.WEAPON]: ['atk'],
    [EquipmentSlot.HELMET]: ['hp'],
    [EquipmentSlot.ARMOR]: ['def'],
    [EquipmentSlot.LEGS]: ['hp', 'def'],
    [EquipmentSlot.ACCESSORY]: ['crit_rate', 'crit_dmg', 'accuracy'],
    [EquipmentSlot.RING]: ['speed', 'resistance']
};

// 副属性池
export const SUB_STATS_POOL = [
    { stat: 'atk', name: '攻击', min: 5, max: 50 },
    { stat: 'atk_pct', name: '攻击%', min: 1, max: 10 },
    { stat: 'hp', name: '生命', min: 50, max: 500 },
    { stat: 'hp_pct', name: '生命%', min: 1, max: 10 },
    { stat: 'def', name: '防御', min: 5, max: 50 },
    { stat: 'def_pct', name: '防御%', min: 1, max: 10 },
    { stat: 'speed', name: '速度', min: 1, max: 8 },
    { stat: 'crit_rate', name: '暴击率', min: 1, max: 5 },
    { stat: 'crit_dmg', name: '暴击伤害', min: 2, max: 8 },
    { stat: 'accuracy', name: '命中', min: 2, max: 8 },
    { stat: 'resistance', name: '抵抗', min: 2, max: 8 }
];

// 稀有度配置
export interface RarityConfig {
    minQuality: EquipmentQuality;
    maxQuality: EquipmentQuality;
    subStatCount: number;
    baseStatMultiplier: number;
    upgradeBonus: number;
}

export const RARITY_CONFIG: Record<EquipmentRarity, RarityConfig> = {
    [EquipmentRarity.COMMON]: {
        minQuality: EquipmentQuality.D,
        maxQuality: EquipmentQuality.C,
        subStatCount: 0,
        baseStatMultiplier: 0.8,
        upgradeBonus: 2
    },
    [EquipmentRarity.UNCOMMON]: {
        minQuality: EquipmentQuality.C,
        maxQuality: EquipmentQuality.B,
        subStatCount: 1,
        baseStatMultiplier: 1.0,
        upgradeBonus: 4
    },
    [EquipmentRarity.RARE]: {
        minQuality: EquipmentQuality.B,
        maxQuality: EquipmentQuality.A,
        subStatCount: 2,
        baseStatMultiplier: 1.2,
        upgradeBonus: 6
    },
    [EquipmentRarity.EPIC]: {
        minQuality: EquipmentQuality.A,
        maxQuality: EquipmentQuality.S,
        subStatCount: 3,
        baseStatMultiplier: 1.5,
        upgradeBonus: 8
    },
    [EquipmentRarity.LEGENDARY]: {
        minQuality: EquipmentQuality.S,
        maxQuality: EquipmentQuality.SS,
        subStatCount: 4,
        baseStatMultiplier: 2.0,
        upgradeBonus: 10
    },
    [EquipmentRarity.MYTHIC]: {
        minQuality: EquipmentQuality.SS,
        maxQuality: EquipmentQuality.SS,
        subStatCount: 4,
        baseStatMultiplier: 2.5,
        upgradeBonus: 15
    }
};

// 品质系数
export const QUALITY_MULTIPLIER: Record<EquipmentQuality, number> = {
    [EquipmentQuality.D]: 0.8,
    [EquipmentQuality.C]: 0.9,
    [EquipmentQuality.B]: 1.0,
    [EquipmentQuality.A]: 1.1,
    [EquipmentQuality.S]: 1.25,
    [EquipmentQuality.SS]: 1.5
};

// 装备品质颜色
export const RARITY_COLORS: Record<EquipmentRarity, { name: string; color: string; glow: string }> = {
    [EquipmentRarity.COMMON]: { name: '普通', color: '#95A5A6', glow: 'rgba(149, 165, 166, 0.3)' },
    [EquipmentRarity.UNCOMMON]: { name: '优秀', color: '#27AE60', glow: 'rgba(39, 174, 96, 0.3)' },
    [EquipmentRarity.RARE]: { name: '稀有', color: '#2980B9', glow: 'rgba(41, 128, 185, 0.3)' },
    [EquipmentRarity.EPIC]: { name: '史诗', color: '#8E44AD', glow: 'rgba(142, 68, 173, 0.3)' },
    [EquipmentRarity.LEGENDARY]: { name: '传说', color: '#F39C12', glow: 'rgba(243, 156, 18, 0.4)' },
    [EquipmentRarity.MYTHIC]: { name: '神话', color: '#E74C3C', glow: 'rgba(231, 76, 60, 0.5)' }
};

// 装备掉落权重（用于随机生成）
export const DROP_WEIGHTS: Record<number, EquipmentRarity> = {
    0.50: EquipmentRarity.COMMON,      // 50%
    0.75: EquipmentRarity.UNCOMMON,    // 25%
    0.90: EquipmentRarity.RARE,        // 15%
    0.97: EquipmentRarity.EPIC,        // 7%
    0.995: EquipmentRarity.LEGENDARY,  // 2.5%
    1.00: EquipmentRarity.MYTHIC       // 0.5%
};

// 品质生成权重
export const QUALITY_WEIGHTS: Record<EquipmentQuality, number> = {
    [EquipmentQuality.D]: 10,
    [EquipmentQuality.C]: 20,
    [EquipmentQuality.B]: 30,
    [EquipmentQuality.A]: 25,
    [EquipmentQuality.S]: 12,
    [EquipmentQuality.SS]: 3
};

// 生成随机品质
export function generateRandomQuality(minQuality?: EquipmentQuality, maxQuality?: EquipmentQuality): EquipmentQuality {
    const min = minQuality || EquipmentQuality.D;
    const max = maxQuality || EquipmentQuality.SS;
    
    const available: EquipmentQuality[] = [];
    for (let q = min; q <= max; q++) {
        const weight = QUALITY_WEIGHTS[q];
        for (let i = 0; i < weight; i++) {
            available.push(q);
        }
    }
    
    return available[Math.floor(Math.random() * available.length)];
}

// 生成随机稀有度
export function generateRandomRarity(bonus: number = 0): EquipmentRarity {
    const roll = Math.random() + bonus;
    
    if (roll >= 0.995) return EquipmentRarity.MYTHIC;
    if (roll >= 0.97) return EquipmentRarity.LEGENDARY;
    if (roll >= 0.90) return EquipmentRarity.EPIC;
    if (roll >= 0.75) return EquipmentRarity.RARE;
    if (roll >= 0.50) return EquipmentRarity.UNCOMMON;
    return EquipmentRarity.COMMON;
}

// 获取升级所需经验
export function getUpgradeCost(level: number, rarity: EquipmentRarity): { gold: number; material: number } {
    const baseGold = 1000;
    const baseMaterial = 1;
    
    return {
        gold: Math.floor(baseGold * Math.pow(1.5, level - 1) * (rarity * 0.5)),
        material: Math.floor(baseMaterial * Math.pow(1.3, level - 1))
    };
}

// 品质鉴定（根据属性值判断品质）
export function identifyQuality(value: number, min: number, max: number): EquipmentQuality {
    const ratio = (value - min) / (max - min);
    
    if (ratio >= 0.95) return EquipmentQuality.SS;
    if (ratio >= 0.85) return EquipmentQuality.S;
    if (ratio >= 0.70) return EquipmentQuality.A;
    if (ratio >= 0.50) return EquipmentQuality.B;
    if (ratio >= 0.30) return EquipmentQuality.C;
    return EquipmentQuality.D;
}

// 装备品质系统类
export class EquipmentQualitySystem {
    // 生成带品质的装备
    public generateEquipment(rarity?: EquipmentRarity, slot?: EquipmentSlot): {
        rarity: EquipmentRarity;
        quality: EquipmentQuality;
        mainStat: { stat: string; value: number };
        subStats: { stat: string; value: number }[];
        score: number;
    } {
        // 随机稀有度
        const finalRarity = rarity || generateRandomRarity();
        const config = RARITY_CONFIG[finalRarity];
        
        // 随机品质
        const quality = generateRandomQuality(config.minQuality, config.maxQuality);
        const qualityMult = QUALITY_MULTIPLIER[quality];
        
        // 随机部位
        const finalSlot = slot || this.randomSlot();
        
        // 生成主属性
        const mainStatType = MAIN_STAT_BY_SLOT[finalSlot][0];
        const baseValue = this.getBaseStatValue(finalSlot, finalRarity);
        const mainStat = {
            stat: mainStatType,
            value: Math.floor(baseValue * config.baseStatMultiplier * qualityMult)
        };
        
        // 生成副属性
        const subStats: { stat: string; value: number }[] = [];
        for (let i = 0; i < config.subStatCount; i++) {
            const subStatDef = SUB_STATS_POOL[Math.floor(Math.random() * SUB_STATS_POOL.length)];
            const subQuality = generateRandomQuality();
            const subMult = QUALITY_MULTIPLIER[subQuality];
            
            subStats.push({
                stat: subStatDef.stat,
                value: Math.floor((subStatDef.min + Math.random() * (subStatDef.max - subStatDef.min)) * subMult)
            });
        }
        
        // 计算装备评分
        const score = this.calculateScore(mainStat, subStats, finalRarity, quality);
        
        return {
            rarity: finalRarity,
            quality,
            mainStat,
            subStats,
            score
        };
    }
    
    private randomSlot(): EquipmentSlot {
        const slots = Object.values(EquipmentSlot);
        return slots[Math.floor(Math.random() * slots.length)];
    }
    
    private getBaseStatValue(slot: EquipmentSlot, rarity: EquipmentRarity): number {
        const baseValues: Record<EquipmentSlot, number> = {
            [EquipmentSlot.WEAPON]: 100,
            [EquipmentSlot.HELMET]: 500,
            [EquipmentSlot.ARMOR]: 80,
            [EquipmentSlot.LEGS]: 400,
            [EquipmentSlot.ACCESSORY]: 50,
            [EquipmentSlot.RING]: 10
        };
        return baseValues[slot] * rarity;
    }
    
    private calculateScore(
        mainStat: { stat: string; value: number },
        subStats: { stat: string; value: number }[],
        rarity: EquipmentRarity,
        quality: EquipmentQuality
    ): number {
        let score = mainStat.value;
        subStats.forEach(sub => score += sub.value * 2); // 副属性权重更高
        score *= rarity * 0.5;
        score *= QUALITY_MULTIPLIER[quality];
        return Math.floor(score);
    }
    
    // 获取装备品质描述
    public getQualityDescription(rarity: EquipmentRarity, quality: EquipmentQuality): string {
        const rarityName = RARITY_COLORS[rarity].name;
        const qualityNames: Record<EquipmentQuality, string> = {
            [EquipmentQuality.D]: '劣质',
            [EquipmentQuality.C]: '普通',
            [EquipmentQuality.B]: '良好',
            [EquipmentQuality.A]: '优秀',
            [EquipmentQuality.S]: '完美',
            [EquipmentQuality.SS]: '传说'
        };
        return `${rarityName}·${qualityNames[quality]}`;
    }
}

// 单例
export const equipmentQualitySystem = new EquipmentQualitySystem();
