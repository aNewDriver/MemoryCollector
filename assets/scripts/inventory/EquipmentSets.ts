/**
 * 装备套装配置
 * 定义各套装的效果和获取方式
 */

import { EquipmentSet, StatType } from '../inventory/InventorySystem';

// 扩展套装配置
export const EXTENDED_EQUIPMENT_SETS: EquipmentSet[] = [
    // 原有套装...
    {
        id: 'warrior_set',
        name: '战士套装',
        description: '远古战士的装备，追求极致的攻击力',
        bonus2: { stat: StatType.ATK, value: 15 },
        bonus4: { stat: StatType.HP, value: 20 }
    },
    {
        id: 'guardian_set',
        name: '守护者套装',
        description: '守护者的坚韧铠甲，坚不可摧',
        bonus2: { stat: StatType.DEF, value: 20 },
        bonus4: { stat: StatType.HP, value: 25 }
    },
    {
        id: 'speed_set',
        name: '疾风套装',
        description: '风一般的速度，先发制人',
        bonus2: { stat: StatType.SPD, value: 10 },
        bonus4: { stat: StatType.SPD, value: 20 }
    },
    {
        id: 'crit_set',
        name: '暴击套装',
        description: '追求致命一击的极致',
        bonus2: { stat: StatType.CRT, value: 12 },
        bonus4: { stat: StatType.CDMG, value: 30 }
    },
    
    // 新增套装
    {
        id: 'healer_set',
        name: '治愈者套装',
        description: '被圣光祝福的装备，增强治疗能力',
        bonus2: { stat: StatType.RES, value: 15 },
        bonus4: { stat: StatType.HP, value: 15 }  // 4件套：治疗效果提升30%（特殊效果）
    },
    {
        id: 'assassin_set',
        name: '刺客套装',
        description: '暗影中的杀手装备',
        bonus2: { stat: StatType.CRT, value: 15 },
        bonus4: { stat: StatType.ATK, value: 25 }  // 4件套：对生命低于50%的敌人伤害+30%
    },
    {
        id: 'berserker_set',
        name: '狂战士套装',
        description: '以血换力的禁忌装备',
        bonus2: { stat: StatType.ATK, value: 20 },
        bonus4: { stat: StatType.CDMG, value: 40 }  // 4件套：生命越低伤害越高
    },
    {
        id: 'mage_set',
        name: '法师套装',
        description: '增强元素力量的神秘装备',
        bonus2: { stat: StatType.ACC, value: 20 },
        bonus4: { stat: StatType.ATK, value: 20 }  // 4件套：技能伤害+25%
    },
    {
        id: 'tank_set',
        name: '铁壁套装',
        description: '专门用于吸引火力的重甲',
        bonus2: { stat: StatType.DEF, value: 25 },
        bonus4: { stat: StatType.HP, value: 30 }  // 4件套：受到伤害减少20%
    },
    {
        id: 'life_steal_set',
        name: '吸血套装',
        description: '从敌人身上汲取生命的邪恶装备',
        bonus2: { stat: StatType.ATK, value: 10 },
        bonus4: { stat: StatType.HP, value: 10 }  // 4件套：造成伤害的15%转化为生命恢复
    },
    {
        id: 'counter_set',
        name: '反击套装',
        description: '以牙还牙的防御装备',
        bonus2: { stat: StatType.DEF, value: 15 },
        bonus4: { stat: StatType.ATK, value: 15 }  // 4件套：受到攻击时有30%概率反击
    },
    {
        id: 'unity_set',
        name: '同心套装',
        description: '团队配合的辅助装备',
        bonus2: { stat: StatType.RES, value: 20 },
        bonus4: { stat: StatType.SPD, value: 15 }  // 4件套：队友行动时自身有20%概率协战
    }
];

// 套装获取途径
export const SET_ACQUISITION = {
    'warrior_set': {
        source: 'chapter_drops',
        chapter: 1,
        dropRate: 'medium'
    },
    'guardian_set': {
        source: 'chapter_drops',
        chapter: 1,
        dropRate: 'medium'
    },
    'speed_set': {
        source: 'tower_drops',
        floor: 50,
        dropRate: 'low'
    },
    'crit_set': {
        source: 'tower_drops',
        floor: 100,
        dropRate: 'low'
    },
    'healer_set': {
        source: 'chapter_drops',
        chapter: 2,
        dropRate: 'medium'
    },
    'assassin_set': {
        source: 'tower_drops',
        floor: 75,
        dropRate: 'low'
    },
    'berserker_set': {
        source: 'trial_reward',
        trialId: 3,
        dropRate: 'guaranteed'
    },
    'mage_set': {
        source: 'chapter_drops',
        chapter: 3,
        dropRate: 'medium'
    },
    'tank_set': {
        source: 'guild_shop',
        cost: { guildCoin: 5000 }
    },
    'life_steal_set': {
        source: 'tower_drops',
        floor: 150,
        dropRate: 'very_low'
    },
    'counter_set': {
        source: 'trial_reward',
        trialId: 2,
        dropRate: 'guaranteed'
    },
    'unity_set': {
        source: 'guild_boss',
        dropRate: 'low'
    }
};

// 装备品质升级配置
export const EQUIPMENT_ENHANCE_CONFIG = {
    maxLevel: 15,
    successRate: [
        100, 100, 100, 100, 100,  // 1-5级：100%
        90, 80, 70, 60, 50,       // 6-10级：递减
        40, 30, 20, 10, 5         // 11-15级：高风险
    ],
    costMultiplier: [
        1, 1, 1, 1, 1,
        1.5, 2, 2.5, 3, 4,
        5, 6, 8, 10, 15
    ]
};

// 装备精炼系统（高级强化）
export interface EquipmentRefine {
    level: number;
    effects: {
        type: 'stat_boost' | 'special_effect';
        target: string;
        value: number;
    }[];
    cost: {
        refineStone: number;
        gold: number;
    };
}

export const REFINE_LEVELS: EquipmentRefine[] = [
    {
        level: 1,
        effects: [{ type: 'stat_boost', target: 'main_stat', value: 5 }],
        cost: { refineStone: 1, gold: 10000 }
    },
    {
        level: 2,
        effects: [{ type: 'stat_boost', target: 'main_stat', value: 10 }],
        cost: { refineStone: 2, gold: 20000 }
    },
    {
        level: 3,
        effects: [
            { type: 'stat_boost', target: 'main_stat', value: 15 },
            { type: 'special_effect', target: 'sub_stat_count', value: 1 }
        ],
        cost: { refineStone: 5, gold: 50000 }
    }
];
