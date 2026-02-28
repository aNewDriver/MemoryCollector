/**
 * 卡牌数据定义
 * 所有卡牌的基础数据结构
 */

// 属性枚举 - 五行 + 光暗体系
export enum ElementType {
    METAL = 'metal',    // 金
    WOOD = 'wood',      // 木
    WATER = 'water',    // 水
    FIRE = 'fire',      // 火
    EARTH = 'earth',    // 土
    LIGHT = 'light',    // 光
    DARK = 'dark'       // 暗
}

// 稀有度枚举 - 扩展为6级
export enum Rarity {
    GREEN = 1,      // 绿色 - 普通
    BLUE = 2,       // 蓝色 - 优秀
    PURPLE = 3,     // 紫色 - 史诗
    GOLD = 4,       // 金色 - 传说
    RED = 5,        // 红色 - 神话
    RAINBOW = 6     // 彩色 - 传说+
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

// ============ 元素克制系统 ============

/**
 * 检查元素克制关系
 * 五行相克：金→木→土→水→火→金
 * 光暗克制所有五行，光暗之间不相克
 * @returns 1: 克制对方, -1: 被克制, 0: 无克制关系
 */
export function checkElementAdvantage(
    attackerElement: ElementType,
    defenderElement: ElementType
): number {
    // 相同元素无克制
    if (attackerElement === defenderElement) return 0;
    
    // 光暗之间不相克
    if ((attackerElement === ElementType.LIGHT && defenderElement === ElementType.DARK) ||
        (attackerElement === ElementType.DARK && defenderElement === ElementType.LIGHT)) {
        return 0;
    }
    
    // 光暗克制所有五行
    const fiveElements = [ElementType.METAL, ElementType.WOOD, ElementType.WATER, ElementType.FIRE, ElementType.EARTH];
    if (fiveElements.includes(attackerElement)) {
        // 五行攻击光暗，被克制
        if (defenderElement === ElementType.LIGHT || defenderElement === ElementType.DARK) {
            return -1;
        }
    }
    if (attackerElement === ElementType.LIGHT || attackerElement === ElementType.DARK) {
        // 光暗攻击五行，克制
        if (fiveElements.includes(defenderElement)) {
            return 1;
        }
    }
    
    // 五行相克关系
    const advantageMap: { [key in ElementType]?: ElementType } = {
        [ElementType.METAL]: ElementType.WOOD,  // 金克木
        [ElementType.WOOD]: ElementType.EARTH,  // 木克土
        [ElementType.EARTH]: ElementType.WATER, // 土克水
        [ElementType.WATER]: ElementType.FIRE,  // 水克火
        [ElementType.FIRE]: ElementType.METAL   // 火克金
    };
    
    if (advantageMap[attackerElement] === defenderElement) {
        return 1;  // 克制
    }
    
    // 检查是否被克制
    if (advantageMap[defenderElement] === attackerElement) {
        return -1;  // 被克制
    }
    
    return 0;  // 无克制
}

/**
 * 获取阵容元素克制加成
 * 如果己方阵容主要元素克制对方，返回加成系数
 */
export function getTeamElementBonus(
    teamElements: ElementType[],
    enemyElements: ElementType[]
): { atkBonus: number; defBonus: number } {
    if (teamElements.length === 0 || enemyElements.length === 0) {
        return { atkBonus: 0, defBonus: 0 };
    }
    
    // 统计己方主要元素（数量最多的元素）
    const elementCount = new Map<ElementType, number>();
    teamElements.forEach(el => {
        elementCount.set(el, (elementCount.get(el) || 0) + 1);
    });
    
    // 找出主要元素
    let mainElement = teamElements[0];
    let maxCount = 0;
    elementCount.forEach((count, el) => {
        if (count > maxCount) {
            maxCount = count;
            mainElement = el;
        }
    });
    
    // 检查是否克制敌方主要元素
    const enemyElementCount = new Map<ElementType, number>();
    enemyElements.forEach(el => {
        enemyElementCount.set(el, (enemyElementCount.get(el) || 0) + 1);
    });
    
    let enemyMainElement = enemyElements[0];
    let enemyMaxCount = 0;
    enemyElementCount.forEach((count, el) => {
        if (count > enemyMaxCount) {
            enemyMaxCount = count;
            enemyMainElement = el;
        }
    });
    
    const advantage = checkElementAdvantage(mainElement, enemyMainElement);
    
    // 克制时 +20% 攻击和防御
    if (advantage === 1) {
        return { atkBonus: 0.2, defBonus: 0.2 };
    }
    
    // 被克制时 -10% 攻击和防御
    if (advantage === -1) {
        return { atkBonus: -0.1, defBonus: -0.1 };
    }
    
    return { atkBonus: 0, defBonus: 0 };
}

/**
 * 获取稀有度显示名称
 */
export function getRarityName(rarity: Rarity): string {
    const names = {
        [Rarity.GREEN]: '绿色',
        [Rarity.BLUE]: '蓝色',
        [Rarity.PURPLE]: '紫色',
        [Rarity.GOLD]: '金色',
        [Rarity.RED]: '红色',
        [Rarity.RAINBOW]: '彩色'
    };
    return names[rarity] || '未知';
}

/**
 * 获取稀有度颜色
 */
export function getRarityColor(rarity: Rarity): { r: number; g: number; b: number } {
    const colors = {
        [Rarity.GREEN]: { r: 50, g: 205, b: 50 },      // 绿
        [Rarity.BLUE]: { r: 30, g: 144, b: 255 },      // 蓝
        [Rarity.PURPLE]: { r: 147, g: 0, b: 211 },     // 紫
        [Rarity.GOLD]: { r: 255, g: 215, b: 0 },       // 金
        [Rarity.RED]: { r: 220, g: 20, b: 60 },        // 红
        [Rarity.RAINBOW]: { r: 255, g: 0, b: 255 }     // 彩(品红)
    };
    return colors[rarity] || { r: 128, g: 128, b: 128 };
}

/**
 * 获取元素显示名称
 */
export function getElementName(element: ElementType): string {
    const names = {
        [ElementType.METAL]: '金',
        [ElementType.WOOD]: '木',
        [ElementType.WATER]: '水',
        [ElementType.FIRE]: '火',
        [ElementType.EARTH]: '土',
        [ElementType.LIGHT]: '光',
        [ElementType.DARK]: '暗'
    };
    return names[element] || '未知';
}
