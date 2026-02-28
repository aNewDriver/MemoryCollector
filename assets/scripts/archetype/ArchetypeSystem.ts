/**
 * 卡牌流派系统
 * 定义各种战斗流派和机制
 */

export enum CardArchetype {
    // 输出流派
    CRIT = 'crit',           // 暴击流 - 高暴击率/暴击伤害
    COMBO = 'combo',         // 连击流 - 多次攻击/额外行动
    POISON = 'poison',       // 毒素流 - 持续伤害/叠加
    BURN = 'burn',           // 灼烧流 - 持续伤害/爆发
    BURST = 'burst',         // 爆发流 - 高单体伤害
    AOE = 'aoe',             // 群攻流 - 范围伤害
    
    // 控制流派
    STUN = 'stun',           // 眩晕流 - 控制/打断
    FREEZE = 'freeze',       // 冰冻流 - 控制/减速
    SILENCE = 'silence',     // 沉默流 - 封印技能
    TAUNT = 'taunt',         // 嘲讽流 - 强制攻击
    
    // 防御流派
    DODGE = 'dodge',         // 闪避流 - 高闪避率
    SHIELD = 'shield',       // 护盾流 - 吸收伤害
    REFLECT = 'reflect',     // 反弹流 - 伤害反弹
    REGEN = 'regen',         // 回复流 - 持续恢复
    
    // 辅助流派
    HEAL = 'heal',           // 治疗流
    BUFF = 'buff',           // 增益流
    DEBUFF = 'debuff',       // 减益流
    REVIVE = 'revive',       // 复活流
    
    // 特殊流派
    EXECUTE = 'execute',     // 斩杀流 - 残血收割
    DRAIN = 'drain',         // 吸血流 - 伤害转生命
    SACRIFICE = 'sacrifice', // 献祭流 - 自伤换输出
    SUMMON = 'summon',       // 召唤流
    COPY = 'copy'            // 复制流 - 复制敌方技能
}

// 流派特性定义
export interface ArchetypeTraits {
    archetype: CardArchetype;
    name: string;
    description: string;
    
    // 核心机制
    coreMechanic: string;
    
    // 推荐属性
    recommendedStats: {
        priority: ('atk' | 'crt' | 'cdmg' | 'spd' | 'hp' | 'def' | 'acc' | 'res')[];
        description: string;
    };
    
    // 克制关系
    strongAgainst: CardArchetype[];
    weakAgainst: CardArchetype[];
    
    // 推荐搭配
    synergies: CardArchetype[];
}

// 流派特性库
export const ARCHETYPE_TRAITS: Record<CardArchetype, ArchetypeTraits> = {
    [CardArchetype.CRIT]: {
        archetype: CardArchetype.CRIT,
        name: '暴击流',
        description: '追求极致的暴击伤害，一击必杀',
        coreMechanic: '高暴击率触发暴击时造成巨额伤害',
        recommendedStats: {
            priority: ['crt', 'cdmg', 'atk'],
            description: '优先堆暴击率和暴击伤害，其次攻击力'
        },
        strongAgainst: [CardArchetype.BURST, CardArchetype.AOE],
        weakAgainst: [CardArchetype.DODGE, CardArchetype.SHIELD],
        synergies: [CardArchetype.EXECUTE, CardArchetype.BURST]
    },
    
    [CardArchetype.COMBO]: {
        archetype: CardArchetype.COMBO,
        name: '连击流',
        description: '快速多次攻击，积少成多',
        coreMechanic: '普攻或技能触发额外攻击次数',
        recommendedStats: {
            priority: ['spd', 'atk', 'crt'],
            description: '优先速度保证先手，其次攻击力和暴击'
        },
        strongAgainst: [CardArchetype.BURST, CardArchetype.SUMMON],
        weakAgainst: [CardArchetype.THORN, CardArchetype.SHIELD],
        synergies: [CardArchetype.POISON, CardArchetype.BURN]
    },
    
    [CardArchetype.POISON]: {
        archetype: CardArchetype.POISON,
        name: '毒素流',
        description: '叠加毒素，持续腐蚀',
        coreMechanic: '技能附加中毒效果，层数越高伤害越高',
        recommendedStats: {
            priority: ['acc', 'atk', 'spd'],
            description: '优先效果命中保证毒素命中，其次攻击力和速度'
        },
        strongAgainst: [CardArchetype.REGEN, CardArchetype.HEAL],
        weakAgainst: [CardArchetype.CLEANSE, CardArchetype.SHIELD],
        synergies: [CardArchetype.COMBO, CardArchetype.BURN]
    },
    
    [CardArchetype.BURN]: {
        archetype: CardArchetype.BURN,
        name: '灼烧流',
        description: '烈焰焚烧，持续伤害',
        coreMechanic: '技能附加燃烧效果，可叠加层数',
        recommendedStats: {
            priority: ['acc', 'atk', 'crt'],
            description: '优先效果命中和攻击力，暴击增加爆发'
        },
        strongAgainst: [CardArchetype.REGEN, CardArchetype.WOOD],
        weakAgainst: [CardArchetype.CLEANSE, CardArchetype.WATER],
        synergies: [CardArchetype.BURST, CardArchetype.AOE]
    },
    
    [CardArchetype.STUN]: {
        archetype: CardArchetype.STUN,
        name: '眩晕流',
        description: '控制敌人，打断节奏',
        coreMechanic: '技能概率眩晕目标，使其无法行动',
        recommendedStats: {
            priority: ['acc', 'spd', 'res'],
            description: '优先效果命中保证控制命中，速度保证先手，抵抗防被控'
        },
        strongAgainst: [CardArchetype.COMBO, CardArchetype.CRIT],
        weakAgainst: [CardArchetype.RES, CardArchetype.CLEANSE],
        synergies: [CardArchetype.FREEZE, CardArchetype.SILENCE]
    },
    
    [CardArchetype.DODGE]: {
        archetype: CardArchetype.DODGE,
        name: '闪避流',
        description: '灵活闪避，难以命中',
        coreMechanic: '高闪避率完全闪避敌方攻击',
        recommendedStats: {
            priority: ['spd', 'res', 'hp'],
            description: '优先速度和抵抗，生命值提高容错'
        },
        strongAgainst: [CardArchetype.CRIT, CardArchetype.BURST],
        weakAgainst: [CardArchetype.ACC, CardArchetype.AOE],
        synergies: [CardArchetype.REFLECT, CardArchetype.COUNTER]
    },
    
    [CardArchetype.SHIELD]: {
        archetype: CardArchetype.SHIELD,
        name: '护盾流',
        description: '坚不可摧，吸收伤害',
        coreMechanic: '技能生成护盾吸收伤害',
        recommendedStats: {
            priority: ['def', 'hp', 'res'],
            description: '优先防御和生命，抵抗防止debuff'
        },
        strongAgainst: [CardArchetype.BURST, CardArchetype.CRIT],
        weakAgainst: [CardArchetype.PENETRATE, CardArchetype.DRAIN],
        synergies: [CardArchetype.REGEN, CardArchetype.TAUNT]
    },
    
    [CardArchetype.HEAL]: {
        archetype: CardArchetype.HEAL,
        name: '治疗流',
        description: '救死扶伤，续航保障',
        coreMechanic: '技能恢复队友生命值',
        recommendedStats: {
            priority: ['atk', 'res', 'spd'],
            description: '攻击力影响治疗量，抵抗防沉默，速度保证及时治疗'
        },
        strongAgainst: [CardArchetype.POISON, CardArchetype.BURN],
        weakAgainst: [CardArchetype.ANTIHEAL, CardArchetype.EXECUTE],
        synergies: [CardArchetype.BUFF, CardArchetype.SHIELD]
    },
    
    [CardArchetype.EXECUTE]: {
        archetype: CardArchetype.EXECUTE,
        name: '斩杀流',
        description: '收割残血，一击必杀',
        coreMechanic: '对低生命敌人造成额外伤害或直接斩杀',
        recommendedStats: {
            priority: ['atk', 'crt', 'spd'],
            description: '攻击力和暴击提高斩杀线，速度保证收割时机'
        },
        strongAgainst: [CardArchetype.HEAL, CardArchetype.REGEN],
        weakAgainst: [CardArchetype.SHIELD, CardArchetype.DODGE],
        synergies: [CardArchetype.CRIT, CardArchetype.BURST]
    },
    
    [CardArchetype.DRAIN]: {
        archetype: CardArchetype.DRAIN,
        name: '吸血流',
        description: '以战养战，越战越勇',
        coreMechanic: '造成伤害的一部分转化为自身生命恢复',
        recommendedStats: {
            priority: ['atk', 'crt', 'def'],
            description: '攻击力和暴击提高吸血量，防御提高生存'
        },
        strongAgainst: [CardArchetype.SUSTAIN, CardArchetype.LONGFIGHT],
        weakAgainst: [CardArchetype.BURST, CardArchetype.ANTIHEAL],
        synergies: [CardArchetype.COMBO, CardArchetype.CRIT]
    },
    
    [CardArchetype.AOE]: {
        archetype: CardArchetype.AOE,
        name: '群攻流',
        description: '范围打击，一网打尽',
        coreMechanic: '技能对多个敌人造成伤害',
        recommendedStats: {
            priority: ['atk', 'crt', 'acc'],
            description: '攻击力和暴击提高伤害，命中保证不miss'
        },
        strongAgainst: [CardArchetype.SUMMON, CardArchetype.SWARM],
        weakAgainst: [CardArchetype.SHIELD, CardArchetype.DODGE],
        synergies: [CardArchetype.BURN, CardArchetype.POISON]
    },
    
    [CardArchetype.BUFF]: {
        archetype: CardArchetype.BUFF,
        name: '增益流',
        description: '强化队友，战力倍增',
        coreMechanic: '技能为队友提供攻击力、防御力等增益',
        recommendedStats: {
            priority: ['spd', 'res', 'hp'],
            description: '速度保证先手buff，抵抗防控制，生命保证生存'
        },
        strongAgainst: [CardArchetype.DEBUFF, CardArchetype.CONTROL],
        weakAgainst: [CardArchetype.DISPEL, CardArchetype.SILENCE],
        synergies: [CardArchetype.HEAL, CardArchetype.SHIELD]
    },
    
    [CardArchetype.REFLECT]: {
        archetype: CardArchetype.REFLECT,
        name: '反弹流',
        description: '以牙还牙，伤敌自护',
        coreMechanic: '受到伤害时反弹一部分给攻击者',
        recommendedStats: {
            priority: ['def', 'hp', 'res'],
            description: '防御和生命提高生存，抵抗防控制'
        },
        strongAgainst: [CardArchetype.COMBO, CardArchetype.CRIT],
        weakAgainst: [CardArchetype.DRAIN, CardArchetype.AOE],
        synergies: [CardArchetype.THORN, CardArchetype.SHIELD]
    },
    
    [CardArchetype.FREEZE]: {
        archetype: CardArchetype.FREEZE,
        name: '冰冻流',
        description: '冰封万物，控制全场',
        coreMechanic: '技能冰冻目标，无法行动且受到额外伤害',
        recommendedStats: {
            priority: ['acc', 'atk', 'spd'],
            description: '效果命中保证冰冻命中，攻击力和速度'
        },
        strongAgainst: [CardArchetype.AGILE, CardArchetype.SPD],
        weakAgainst: [CardArchetype.RES, CardArchetype.CLEANSE],
        synergies: [CardArchetype.STUN, CardArchetype.SILENCE]
    },
    
    [CardArchetype.REGEN]: {
        archetype: CardArchetype.REGEN,
        name: '回复流',
        description: '生生不息，持续恢复',
        coreMechanic: '每回合自动恢复生命值',
        recommendedStats: {
            priority: ['hp', 'def', 'res'],
            description: '生命和防御提高生存，抵抗防debuff'
        },
        strongAgainst: [CardArchetype.POISON, CardArchetype.BURN],
        weakAgainst: [CardArchetype.ANTIHEAL, CardArchetype.EXECUTE],
        synergies: [CardArchetype.SHIELD, CardArchetype.DEF]
    },
    
    [CardArchetype.SILENCE]: {
        archetype: CardArchetype.SILENCE,
        name: '沉默流',
        description: '封印技能，寸步难行',
        coreMechanic: '沉默目标使其无法使用技能',
        recommendedStats: {
            priority: ['acc', 'spd', 'res'],
            description: '效果命中保证沉默命中，速度先手，抵抗防反控'
        },
        strongAgainst: [CardArchetype.SKILL, CardArchetype.MAGE],
        weakAgainst: [CardArchetype.RES, CardArchetype.CLEANSE],
        synergies: [CardArchetype.STUN, CardArchetype.FREEZE]
    },
    
    [CardArchetype.TAUNT]: {
        archetype: CardArchetype.TAUNT,
        name: '嘲讽流',
        description: '吸引火力，保护队友',
        coreMechanic: '强制敌人攻击自己，保护脆弱队友',
        recommendedStats: {
            priority: ['def', 'hp', 'res'],
            description: '防御和生命提高生存，抵抗防控制'
        },
        strongAgainst: [CardArchetype.ASSASSIN, CardArchetype.BURST],
        weakAgainst: [CardArchetype.AOE, CardArchetype.IGNORE],
        synergies: [CardArchetype.SHIELD, CardArchetype.REGEN]
    },
    
    [CardArchetype.REVIVE]: {
        archetype: CardArchetype.REVIVE,
        name: '复活流',
        description: '起死回生，逆转战局',
        coreMechanic: '复活阵亡队友或自身免死一次',
        recommendedStats: {
            priority: ['res', 'hp', 'def'],
            description: '抵抗防控制，生命和防御提高生存'
        },
        strongAgainst: [CardArchetype.EXECUTE, CardArchetype.BURST],
        weakAgainst: [CardArchetype.ANTIREVIVE, CardArchetype.SEAL],
        synergies: [CardArchetype.HEAL, CardArchetype.SHIELD]
    },
    
    [CardArchetype.SACRIFICE]: {
        archetype: CardArchetype.SACRIFICE,
        name: '献祭流',
        description: '燃烧生命，换取力量',
        coreMechanic: '消耗自身生命造成高额伤害',
        recommendedStats: {
            priority: ['atk', 'hp', 'def'],
            description: '攻击力提高伤害，生命保证不被自己耗死'
        },
        strongAgainst: [CardArchetype.SHIELD, CardArchetype.DEF],
        weakAgainst: [CardArchetype.EXECUTE, CardArchetype.BURST],
        synergies: [CardArchetype.DRAIN, CardArchetype.REGEN]
    },
    
    [CardArchetype.SUMMON]: {
        archetype: CardArchetype.SUMMON,
        name: '召唤流',
        description: '召唤援军，人多势众',
        coreMechanic: '召唤额外单位协助战斗',
        recommendedStats: {
            priority: ['atk', 'hp', 'spd'],
            description: '攻击力影响召唤物强度，生命和速度'
        },
        strongAgainst: [CardArchetype.SINGLE, CardArchetype.CONTROL],
        weakAgainst: [CardArchetype.AOE, CardArchetype.CLEAR],
        synergies: [CardArchetype.SWARM, CardArchetype.NUMBER]
    },
    
    [CardArchetype.COPY]: {
        archetype: CardArchetype.COPY,
        name: '复制流',
        description: '以彼之道，还施彼身',
        coreMechanic: '复制敌方技能或反弹效果',
        recommendedStats: {
            priority: ['res', 'spd', 'hp'],
            description: '抵抗保证能复制，速度先手，生命生存'
        },
        strongAgainst: [CardArchetype.SKILL, CardArchetype.SPECIAL],
        weakAgainst: [CardArchetype.BASIC, CardArchetype.SIMPLE],
        synergies: [CardArchetype.REFLECT, CardArchetype.COUNTER]
    },
    
    [CardArchetype.BURST]: {
        archetype: CardArchetype.BURST,
        name: '爆发流',
        description: '一击必杀，瞬间输出',
        coreMechanic: '积攒能量后释放超高伤害技能',
        recommendedStats: {
            priority: ['atk', 'crt', 'cdmg'],
            description: '攻击力、暴击率、暴击伤害最大化'
        },
        strongAgainst: [CardArchetype.HEAL, CardArchetype.SHIELD],
        weakAgainst: [CardArchetype.DODGE, CardArchetype.DEF],
        synergies: [CardArchetype.CRIT, CardArchetype.EXECUTE]
    }
};

// 获取流派信息
export function getArchetypeInfo(archetype: CardArchetype): ArchetypeTraits {
    return ARCHETYPE_TRAITS[archetype];
}

// 获取所有流派列表
export function getAllArchetypes(): CardArchetype[] {
    return Object.values(CardArchetype);
}

// 获取流派名称
export function getArchetypeName(archetype: CardArchetype): string {
    return ARCHETYPE_TRAITS[archetype]?.name || archetype;
}