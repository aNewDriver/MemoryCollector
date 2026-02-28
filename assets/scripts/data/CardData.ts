/**
 * 卡牌数据定义
 * 所有卡牌的基础数据结构
 */

// 属性枚举
export enum ElementType {
    FIRE = 'fire',      // 火
    WATER = 'water',    // 水
    WIND = 'wind',      // 风
    EARTH = 'earth',    // 土
    LIGHT = 'light',    // 光
    DARK = 'dark'       // 暗
}

export enum Rarity {
    COMMON = 1,     // 普通 - 灰
    RARE = 2,       // 稀有 - 蓝
    EPIC = 3,       // 史诗 - 紫
    LEGEND = 4,     // 传说 - 金
    MYTH = 5        // 神话 - 红
}

// 卡牌基础数据（静态配置）
export interface CardData {
    id: string;
    name: string;
    title: string;          // 称号，如"最后的武士"
    rarity: Rarity;
    element: ElementType;
    
    // 立绘资源路径
    art: {
        portrait: string;   // 头像
        fullbody: string;   // 全身立绘
        awakened?: string;  // 觉醒立绘
    };
    
    // 背景故事
    story: {
        summary: string;    // 简介
        background: string; // 完整背景
        memory1?: string;   // 解锁剧情1
        memory2?: string;   // 解锁剧情2
        memory3?: string;   // 解锁剧情3
    };
    
    // 技能
    skills: {
        normal: SkillData;
        special: SkillData;
        passive?: SkillData;
    };
    
    // 基础属性（1级时）
    baseStats: Stats;
    
    // 成长系数
    growth: {
        hp: number;
        atk: number;
        def: number;
        spd: number;
    };
}

// 技能数据
export interface SkillData {
    id: string;
    name: string;
    description: string;
    icon: string;
    
    // 消耗
    cost: number;           // 能量消耗，0表示普攻
    cooldown: number;       // 冷却回合
    
    // 效果
    effects: EffectData[];
    
    // 动画
    animation?: string;
}

// 效果数据
export interface EffectData {
    type: EffectType;
    target: TargetType;
    value: number;
    duration?: number;      // 持续回合
    chance?: number;        // 触发概率
}

export enum EffectType {
    DAMAGE = 'damage',
    HEAL = 'heal',
    BUFF_ATK = 'buff_atk',
    BUFF_DEF = 'buff_def',
    BUFF_SPD = 'buff_spd',
    DEBUFF_ATK = 'debuff_atk',
    DEBUFF_DEF = 'debuff_def',
    BURN = 'burn',
    FREEZE = 'freeze',
    POISON = 'poison',
    STUN = 'stun',
    TAUNT = 'taunt',
    SHIELD = 'shield',
    REVIVE = 'revive',
    CLEANSE = 'cleanse',
    DISPEL = 'dispel'
}

export enum TargetType {
    SELF = 'self',
    SINGLE_ENEMY = 'single_enemy',
    ALL_ENEMIES = 'all_enemies',
    SINGLE_ALLY = 'single_ally',
    ALL_ALLIES = 'all_allies',
    FRONT_ROW = 'front_row',
    BACK_ROW = 'back_row',
    LOWEST_HP = 'lowest_hp',
    HIGHEST_ATK = 'highest_atk'
}

// 属性
export interface Stats {
    hp: number;
    atk: number;
    def: number;
    spd: number;
    crt: number;        // 暴击率（百分比）
    cdmg: number;       // 暴击伤害（百分比）
    acc: number;        // 效果命中
    res: number;        // 效果抵抗
}

// 玩家拥有的卡牌实例（动态数据）
export interface CardInstance {
    instanceId: string;     // 唯一实例ID
    cardId: string;         // 关联的卡牌配置ID
    
    // 养成数据
    level: number;
    exp: number;
    ascension: number;      // 突破次数
    
    // 技能等级
    skillLevels: {
        normal: number;
        special: number;
        passive: number;
    };
    
    // 亲密度
    affinity: number;
    affinityLevel: number;
    
    // 觉醒
    awakened: boolean;
    
    // 装备
    equipments: (string | null)[];  // 6个装备位
    
    // 当前属性（计算后）
    currentStats: Stats;
}

// 羁绊数据
export interface BondData {
    id: string;
    name: string;
    cardIds: string[];      // 触发羁绊的卡牌
    description: string;
    effect: EffectData;
}
