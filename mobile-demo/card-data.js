/**
 * 记忆回收者 - 完整游戏系统 v0.4
 * 从主项目同步的核心代码
 */

// ==================== 常量定义 ====================
const ELEMENT_TYPE = {
    METAL: 'metal', WOOD: 'wood', WATER: 'water', 
    FIRE: 'fire', EARTH: 'earth', LIGHT: 'light', DARK: 'dark'
};

const RARITY = {
    N: 1, R: 2, SR: 3, SSR: 4, UR: 5
};

// 元素克制关系
const ELEMENT_ADVANTAGE = {
    [ELEMENT_TYPE.FIRE]: ELEMENT_TYPE.METAL,
    [ELEMENT_TYPE.METAL]: ELEMENT_TYPE.WOOD,
    [ELEMENT_TYPE.WOOD]: ELEMENT_TYPE.EARTH,
    [ELEMENT_TYPE.EARTH]: ELEMENT_TYPE.WATER,
    [ELEMENT_TYPE.WATER]: ELEMENT_TYPE.FIRE,
    [ELEMENT_TYPE.LIGHT]: ELEMENT_TYPE.DARK,
    [ELEMENT_TYPE.DARK]: ELEMENT_TYPE.LIGHT
};

// 元素图标和颜色
const ELEMENT_DATA = {
    [ELEMENT_TYPE.FIRE]: { icon: '🔥', color: '#ff6b6b', name: '火' },
    [ELEMENT_TYPE.WATER]: { icon: '💧', color: '#4ecdc4', name: '水' },
    [ELEMENT_TYPE.WOOD]: { icon: '🌿', color: '#95e1d3', name: '木' },
    [ELEMENT_TYPE.METAL]: { icon: '⚔️', color: '#c0c0c0', name: '金' },
    [ELEMENT_TYPE.EARTH]: { icon: '🏔️', color: '#d4a574', name: '土' },
    [ELEMENT_TYPE.LIGHT]: { icon: '✨', color: '#ffd700', name: '光' },
    [ELEMENT_TYPE.DARK]: { icon: '🌑', color: '#8b7dd4', name: '暗' }
};

// ==================== 技能系统 ====================
const SKILL_TYPE = {
    ACTIVE: 'active',
    PASSIVE: 'passive'
};

const EFFECT_TYPE = {
    DAMAGE: 'damage',
    HEAL: 'heal',
    BUFF_ATK: 'buff_atk',
    BUFF_DEF: 'buff_def',
    BUFF_SPD: 'buff_spd',
    DEBUFF_ATK: 'debuff_atk',
    DEBUFF_DEF: 'debuff_def',
    SHIELD: 'shield',
    TAUNT: 'taunt',
    REVIVE: 'revive'
};

// ==================== 卡牌数据库 ====================
const CARD_DATABASE = {
    SSR: [
        {
            id: 'SSR001', name: '烬羽', element: ELEMENT_TYPE.FIRE, rarity: 'SSR',
            hp: 3500, atk: 850, def: 280, spd: 85, crit: 15, icon: '🔥',
            skills: [
                { id: 's1', name: '烈焰斩', type: SKILL_TYPE.ACTIVE, damage: 1.8, target: 'single', cd: 3, 
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.8 }], desc: '造成180%攻击伤害' },
                { id: 'p1', name: '狂暴', type: SKILL_TYPE.PASSIVE, trigger: 'hp<30', 
                  effects: [{ type: EFFECT_TYPE.BUFF_ATK, value: 0.5 }], desc: '生命低于30%时攻击+50%' }
            ]
        },
        {
            id: 'SSR002', name: '青漪', element: ELEMENT_TYPE.WATER, rarity: 'SSR',
            hp: 2800, atk: 920, def: 220, spd: 95, crit: 12, icon: '💧',
            skills: [
                { id: 's1', name: '治愈之音', type: SKILL_TYPE.ACTIVE, heal: 0.3, target: 'single', cd: 3,
                  effects: [{ type: EFFECT_TYPE.HEAL, value: 0.3 }], desc: '恢复30%生命' },
                { id: 's2', name: '潮汐冲击', type: SKILL_TYPE.ACTIVE, damage: 1.0, target: 'all', cd: 4,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.0 }], desc: '全体100%伤害' }
            ]
        },
        {
            id: 'SSR003', name: '银锋', element: ELEMENT_TYPE.METAL, rarity: 'SSR',
            hp: 2600, atk: 980, def: 200, spd: 110, crit: 25, icon: '⚔️',
            skills: [
                { id: 's1', name: '背刺', type: SKILL_TYPE.ACTIVE, damage: 1.5, target: 'single', cd: 2,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.5 }], desc: '150%伤害' },
                { id: 'p1', name: '致命一击', type: SKILL_TYPE.PASSIVE,
                  effects: [{ type: 'crit_dmg', value: 0.5 }], desc: '暴击伤害+50%' }
            ]
        },
        {
            id: 'SSR004', name: '岳尘', element: ELEMENT_TYPE.EARTH, rarity: 'SSR',
            hp: 4200, atk: 620, def: 420, spd: 60, crit: 8, icon: '🏔️',
            skills: [
                { id: 's1', name: '嘲讽', type: SKILL_TYPE.ACTIVE, effect: 'taunt', target: 'all', cd: 4,
                  effects: [{ type: EFFECT_TYPE.TAUNT, value: 1 }], desc: '强制敌人攻击自己' },
                { id: 'p1', name: '坚韧', type: SKILL_TYPE.PASSIVE,
                  effects: [{ type: EFFECT_TYPE.BUFF_DEF, value: 0.3 }], desc: '防御+30%' }
            ]
        },
        {
            id: 'SSR005', name: '明烛', element: ELEMENT_TYPE.LIGHT, rarity: 'SSR',
            hp: 3000, atk: 580, def: 260, spd: 75, crit: 10, icon: '✨',
            skills: [
                { id: 's1', name: '圣光治愈', type: SKILL_TYPE.ACTIVE, heal: 0.4, target: 'single', cd: 3,
                  effects: [{ type: EFFECT_TYPE.HEAL, value: 0.4 }], desc: '恢复40%生命' },
                { id: 's2', name: '复活', type: SKILL_TYPE.ACTIVE, effect: 'revive', heal: 0.3, target: 'dead', cd: 6,
                  effects: [{ type: EFFECT_TYPE.REVIVE, value: 0.3 }], desc: '复活队友30%生命' }
            ]
        },
        {
            id: 'SSR006', name: '幽夜', element: ELEMENT_TYPE.DARK, rarity: 'SSR',
            hp: 2900, atk: 950, def: 210, spd: 90, crit: 18, icon: '🌑',
            skills: [
                { id: 's1', name: '暗影 burst', type: SKILL_TYPE.ACTIVE, damage: 2.0, target: 'single', cd: 3,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 2.0 }], desc: '200%伤害' },
                { id: 'p1', name: '生命汲取', type: SKILL_TYPE.PASSIVE, effect: 'lifesteal', value: 0.15,
                  effects: [{ type: 'lifesteal', value: 0.15 }], desc: '伤害15%转化为生命' }
            ]
        },
        // 新增SSR卡
        {
            id: 'SSR007', name: '风语者', element: ELEMENT_TYPE.WOOD, rarity: 'SSR',
            hp: 2700, atk: 890, def: 240, spd: 120, crit: 20, icon: '🌪️',
            skills: [
                { id: 's1', name: '疾风步', type: SKILL_TYPE.ACTIVE, damage: 1.6, target: 'single', cd: 2,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.6 }, { type: EFFECT_TYPE.BUFF_SPD, value: 0.3 }],
                  desc: '160%伤害，自身速度+30%（3回合）' },
                { id: 'p1', name: '风之痕', type: SKILL_TYPE.PASSIVE,
                  effects: [{ type: 'extra_turn', chance: 0.2 }],
                  desc: '20%概率额外行动一次' }
            ]
        },
        {
            id: 'SSR008', name: '雷霆裁决', element: ELEMENT_TYPE.METAL, rarity: 'SSR',
            hp: 3200, atk: 950, def: 300, spd: 70, crit: 15, icon: '⚡',
            skills: [
                { id: 's1', name: '雷霆一击', type: SKILL_TYPE.ACTIVE, damage: 2.2, target: 'single', cd: 4,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 2.2 }],
                  desc: '220%伤害，50%概率眩晕（1回合）' },
                { id: 's2', name: '闪电链', type: SKILL_TYPE.ACTIVE, damage: 1.0, target: 'all', cd: 5,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.0 }],
                  desc: '全体100%雷属性伤害' }
            ]
        },
        {
            id: 'SSR009', name: '生命之树', element: ELEMENT_TYPE.WOOD, rarity: 'SSR',
            hp: 3800, atk: 520, def: 350, spd: 60, crit: 8, icon: '🌳',
            skills: [
                { id: 's1', name: '生命绽放', type: SKILL_TYPE.ACTIVE, heal: 0.35, target: 'all', cd: 4,
                  effects: [{ type: EFFECT_TYPE.HEAL, value: 0.35 }],
                  desc: '全体恢复35%生命' },
                { id: 'p1', name: '自然守护', type: SKILL_TYPE.PASSIVE,
                  effects: [{ type: 'regen', value: 0.05 }],
                  desc: '每回合开始时，全体恢复5%生命' }
            ]
        },
        {
            id: 'SSR010', name: '虚空行者', element: ELEMENT_TYPE.DARK, rarity: 'SSR',
            hp: 2500, atk: 920, def: 200, spd: 100, crit: 22, icon: '🌌',
            skills: [
                { id: 's1', name: '虚空裂隙', type: SKILL_TYPE.ACTIVE, damage: 1.8, target: 'single', cd: 3,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.8 }, { type: EFFECT_TYPE.DEBUFF_DEF, value: 0.3 }],
                  desc: '180%伤害，降低目标30%防御（2回合）' },
                { id: 's2', name: '维度穿梭', type: SKILL_TYPE.ACTIVE, effect: 'invincible', target: 'self', cd: 6,
                  effects: [{ type: 'invincible', duration: 1 }],
                  desc: '下回合免疫所有伤害' }
            ]
        },
        {
            id: 'SSR011', name: '太阳神官', element: ELEMENT_TYPE.LIGHT, rarity: 'SSR',
            hp: 3100, atk: 680, def: 280, spd: 80, crit: 12, icon: '☀️',
            skills: [
                { id: 's1', name: '神圣庇护', type: SKILL_TYPE.ACTIVE, effect: 'shield', target: 'all', cd: 4,
                  effects: [{ type: EFFECT_TYPE.SHIELD, value: 0.2 }],
                  desc: '全体获得20%最大生命的护盾' },
                { id: 'p1', name: '日光普照', type: SKILL_TYPE.PASSIVE,
                  effects: [{ type: EFFECT_TYPE.BUFF_ATK, value: 0.1 }],
                  desc: '全体友方攻击力+10%' }
            ]
        },
        {
            id: 'SSR012', name: '深渊吞噬者', element: ELEMENT_TYPE.WATER, rarity: 'SSR',
            hp: 3600, atk: 780, def: 320, spd: 55, crit: 10, icon: '🌊',
            skills: [
                { id: 's1', name: '深渊之口', type: SKILL_TYPE.ACTIVE, damage: 1.4, target: 'all', cd: 4,
                  effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.4 }, { type: EFFECT_TYPE.TAUNT, value: 1 }],
                  desc: '全体140%伤害，嘲讽（2回合）' },
                { id: 'p1', name: '深海之力', type: SKILL_TYPE.PASSIVE,
                  effects: [{ type: 'hp_regen', value: 0.08 }],
                  desc: '每回合恢复8%最大生命' }
            ]
        },
        // SSR扩展 (13-20)
        {
            id: 'SSR013', name: '风神', element: ELEMENT_TYPE.WOOD, rarity: 'SSR',
            hp: 2750, atk: 900, def: 245, spd: 125, crit: 21, icon: '🌪️',
            skills: [
                { id: 's1', name: '风神斩', type: SKILL_TYPE.ACTIVE, damage: 1.85, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.85 }], desc: '185%伤害，全体加速' },
                { id: 'p1', name: '风之祝福', type: SKILL_TYPE.PASSIVE, effects: [{ type: EFFECT_TYPE.BUFF_SPD, value: 0.15 }], desc: '全体速度+15%' }
            ]
        },
        {
            id: 'SSR014', name: '雷神', element: ELEMENT_TYPE.METAL, rarity: 'SSR',
            hp: 3250, atk: 960, def: 305, spd: 72, crit: 16, icon: '⚡',
            skills: [
                { id: 's1', name: '雷神之怒', type: SKILL_TYPE.ACTIVE, damage: 2.3, cd: 4, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 2.3 }], desc: '230%伤害，眩晕' },
                { id: 's2', name: '雷霆万钧', type: SKILL_TYPE.ACTIVE, damage: 1.1, cd: 5, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.1 }], desc: '全体110%雷伤害' }
            ]
        },
        {
            id: 'SSR015', name: '世界树', element: ELEMENT_TYPE.WOOD, rarity: 'SSR',
            hp: 3900, atk: 530, def: 355, spd: 61, crit: 9, icon: '🌳',
            skills: [
                { id: 's1', name: '生命之光', type: SKILL_TYPE.ACTIVE, heal: 0.4, cd: 4, effects: [{ type: EFFECT_TYPE.HEAL, value: 0.4 }], desc: '全体恢复40%生命' },
                { id: 'p1', name: '永恒生命', type: SKILL_TYPE.PASSIVE, effects: [{ type: 'regen', value: 0.06 }], desc: '每回合恢复6%生命' }
            ]
        },
        {
            id: 'SSR016', name: '虚空领主', element: ELEMENT_TYPE.DARK, rarity: 'SSR',
            hp: 2550, atk: 930, def: 205, spd: 102, crit: 23, icon: '🌌',
            skills: [
                { id: 's1', name: '虚空吞噬', type: SKILL_TYPE.ACTIVE, damage: 1.9, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.9 }], desc: '190%伤害，降防' },
                { id: 's2', name: '虚空护盾', type: SKILL_TYPE.ACTIVE, effect: 'invincible', cd: 6, effects: [{ type: 'invincible', duration: 1 }], desc: '免疫伤害1回合' }
            ]
        },
        {
            id: 'SSR017', name: '太阳神', element: ELEMENT_TYPE.LIGHT, rarity: 'SSR',
            hp: 3150, atk: 690, def: 285, spd: 81, crit: 13, icon: '☀️',
            skills: [
                { id: 's1', name: '太阳审判', type: SKILL_TYPE.ACTIVE, damage: 1.7, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.7 }], desc: '170%伤害，灼烧' },
                { id: 'p1', name: '太阳光辉', type: SKILL_TYPE.PASSIVE, effects: [{ type: EFFECT_TYPE.BUFF_ATK, value: 0.12 }], desc: '全体攻击+12%' }
            ]
        },
        {
            id: 'SSR018', name: '深海之主', element: ELEMENT_TYPE.WATER, rarity: 'SSR',
            hp: 3700, atk: 790, def: 325, spd: 56, crit: 11, icon: '🌊',
            skills: [
                { id: 's1', name: '深海吞噬', type: SKILL_TYPE.ACTIVE, damage: 1.5, cd: 4, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.5 }], desc: '全体150%伤害' },
                { id: 'p1', name: '深海恢复', type: SKILL_TYPE.PASSIVE, effects: [{ type: 'hp_regen', value: 0.09 }], desc: '每回合恢复9%生命' }
            ]
        },
        {
            id: 'SSR019', name: '炎帝', element: ELEMENT_TYPE.FIRE, rarity: 'SSR',
            hp: 3400, atk: 920, def: 290, spd: 78, crit: 18, icon: '🔥',
            skills: [
                { id: 's1', name: '炎帝斩', type: SKILL_TYPE.ACTIVE, damage: 2.1, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 2.1 }], desc: '210%伤害，灼烧' },
                { id: 'p1', name: '炎帝之力', type: SKILL_TYPE.PASSIVE, effects: [{ type: EFFECT_TYPE.BUFF_ATK, value: 0.2 }], desc: '攻击+20%' }
            ]
        },
        {
            id: 'SSR020', name: '大地之母', element: ELEMENT_TYPE.EARTH, rarity: 'SSR',
            hp: 4500, atk: 600, def: 450, spd: 52, crit: 7, icon: '🏔️',
            skills: [
                { id: 's1', name: '大地震撼', type: SKILL_TYPE.ACTIVE, damage: 1.6, cd: 4, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.6 }], desc: '全体160%伤害，眩晕' },
                { id: 'p1', name: '大地守护', type: SKILL_TYPE.PASSIVE, effects: [{ type: EFFECT_TYPE.BUFF_DEF, value: 0.25 }], desc: '防御+25%' }
            ]
        }
    ],
    SR: [
        { id: 'SR001', name: '炎心', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 2800, atk: 680, def: 220, spd: 80, crit: 12, icon: '🔥',
          skills: [{ id: 's1', name: '火焰冲击', type: SKILL_TYPE.ACTIVE, damage: 1.5, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.5 }], desc: '150%火伤害' }] },
        { id: 'SR002', name: '流霜', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 2200, atk: 740, def: 180, spd: 90, crit: 10, icon: '💧',
          skills: [{ id: 's1', name: '冰霜箭', type: SKILL_TYPE.ACTIVE, damage: 1.4, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.4 }], desc: '140%伤害' }] },
        { id: 'SR003', name: '铁壁', element: ELEMENT_TYPE.METAL, rarity: 'SR', hp: 3400, atk: 500, def: 340, spd: 55, crit: 6, icon: '🛡️',
          skills: [{ id: 's1', name: '盾击', type: SKILL_TYPE.ACTIVE, damage: 1.2, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.2 }], desc: '120%伤害+护盾' }] },
        { id: 'SR004', name: '翠影', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 2100, atk: 780, def: 160, spd: 100, crit: 20, icon: '🌿',
          skills: [{ id: 's1', name: '连环击', type: SKILL_TYPE.ACTIVE, damage: 1.3, cd: 2, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.3 }], desc: '130%伤害连击' }] },
        { id: 'SR005', name: '磐石', element: ELEMENT_TYPE.EARTH, rarity: 'SR', hp: 3200, atk: 580, def: 320, spd: 65, crit: 8, icon: '🪨',
          skills: [{ id: 's1', name: '地震', type: SKILL_TYPE.ACTIVE, damage: 1.1, cd: 4, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.1 }], desc: '全体110%伤害' }] },
        { id: 'SR006', name: '晨曦', element: ELEMENT_TYPE.LIGHT, rarity: 'SR', hp: 2400, atk: 460, def: 210, spd: 70, crit: 8, icon: '🌅',
          skills: [{ id: 's1', name: '圣光治疗', type: SKILL_TYPE.ACTIVE, heal: 0.25, cd: 3, effects: [{ type: EFFECT_TYPE.HEAL, value: 0.25 }], desc: '恢复25%生命' }] },
        { id: 'SR007', name: '暗影', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 2300, atk: 760, def: 170, spd: 95, crit: 22, icon: '🌑',
          skills: [{ id: 's1', name: '暗影突袭', type: SKILL_TYPE.ACTIVE, damage: 1.6, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.6 }], desc: '160%伤害' }] },
        // 新增SR卡
        { id: 'SR008', name: '暴风射手', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 2300, atk: 760, def: 170, spd: 105, crit: 18, icon: '🏹',
          skills: [{ id: 's1', name: '连射', type: SKILL_TYPE.ACTIVE, damage: 0.9, cd: 2, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 0.9 }], desc: '随机射击3次，每次90%伤害' }] },
        { id: 'SR009', name: '岩浆巨人', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 3600, atk: 580, def: 360, spd: 45, crit: 6, icon: '🌋',
          skills: [{ id: 's1', name: '岩浆喷发', type: SKILL_TYPE.ACTIVE, damage: 1.3, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.3 }], desc: '130%伤害，附加灼烧' }] },
        { id: 'SR010', name: '霜冻法师', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 2100, atk: 720, def: 160, spd: 85, crit: 12, icon: '❄️',
          skills: [{ id: 's1', name: '冰霜新星', type: SKILL_TYPE.ACTIVE, damage: 1.1, cd: 4, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.1 }], desc: '全体110%伤害，30%概率冰冻' }] },
        { id: 'SR011', name: '圣骑士', element: ELEMENT_TYPE.LIGHT, rarity: 'SR', hp: 3300, atk: 620, def: 300, spd: 60, crit: 8, icon: '⚜️',
          skills: [{ id: 's1', name: '圣光斩', type: SKILL_TYPE.ACTIVE, damage: 1.4, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.4 }], desc: '140%伤害，吸血15%' }] },
        { id: 'SR012', name: '影舞者', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 2200, atk: 790, def: 150, spd: 115, crit: 25, icon: '🎭',
          skills: [{ id: 's1', name: '影分身', type: SKILL_TYPE.ACTIVE, damage: 1.2, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.2 }], desc: '120%伤害，闪避+50%' }] },
        { id: 'SR013', name: '沙漠守护者', element: ELEMENT_TYPE.EARTH, rarity: 'SR', hp: 3100, atk: 560, def: 330, spd: 50, crit: 7, icon: '🏺',
          skills: [{ id: 's1', name: '沙尘暴', type: SKILL_TYPE.ACTIVE, damage: 1.0, cd: 4, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.0 }], desc: '全体100%伤害，降低命中' }] },
        { id: 'SR014', name: '雷霆战锤', element: ELEMENT_TYPE.METAL, rarity: 'SR', hp: 2900, atk: 700, def: 260, spd: 65, crit: 14, icon: '🔨',
          skills: [{ id: 's1', name: '雷霆猛击', type: SKILL_TYPE.ACTIVE, damage: 1.7, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.7 }], desc: '170%伤害，无视20%防御' }] },
        // SR级卡牌扩展2
        { id: 'SR016', name: '疾风剑士', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 2350, atk: 775, def: 165, spd: 108, crit: 19, icon: '🍃',
          skills: [{ id: 's1', name: '风斩', type: 'active', damage: 1.55, cd: 3, effects: [{ type: 'damage', value: 1.55 }], desc: '155%伤害，速度+15%' }] },
        { id: 'SR017', name: '熔岩兽', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 3700, atk: 590, def: 370, spd: 46, crit: 7, icon: '🌋',
          skills: [{ id: 's1', name: '熔岩喷吐', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害，灼烧3回合' }] },
        { id: 'SR018', name: '寒冰巫师', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 2150, atk: 730, def: 165, spd: 86, crit: 13, icon: '❄️',
          skills: [{ id: 's1', name: '冰风暴', type: 'active', damage: 1.15, cd: 4, effects: [{ type: 'damage', value: 1.15 }], desc: '全体115%伤害，减速' }] },
        { id: 'SR019', name: '圣殿骑士', element: ELEMENT_TYPE.LIGHT, rarity: 'SR', hp: 3350, atk: 630, def: 305, spd: 61, crit: 9, icon: '⚜️',
          skills: [{ id: 's1', name: '圣光冲击', type: 'active', damage: 1.45, cd: 3, effects: [{ type: 'damage', value: 1.45 }], desc: '145%伤害，恢复10%生命' }] },
        { id: 'SR020', name: '夜刃', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 2250, atk: 800, def: 155, spd: 118, crit: 26, icon: '🎭',
          skills: [{ id: 's1', name: '夜袭', type: 'active', damage: 1.65, cd: 3, effects: [{ type: 'damage', value: 1.65 }], desc: '165%伤害，暴击+20%' }] },
        { id: 'SR021', name: '沙漠之王', element: ELEMENT_TYPE.EARTH, rarity: 'SR', hp: 3150, atk: 570, def: 335, spd: 51, crit: 8, icon: '🏺',
          skills: [{ id: 's1', name: '沙瀑', type: 'active', damage: 1.05, cd: 4, effects: [{ type: 'damage', value: 1.05 }], desc: '全体105%伤害，致盲' }] },
        { id: 'SR022', name: '雷神使者', element: ELEMENT_TYPE.METAL, rarity: 'SR', hp: 2950, atk: 710, def: 265, spd: 66, crit: 15, icon: '🔨',
          skills: [{ id: 's1', name: '雷霆打击', type: 'active', damage: 1.75, cd: 3, effects: [{ type: 'damage', value: 1.75 }], desc: '175%伤害，破甲25%' }] },
        { id: 'SR023', name: '海洋祭祀', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 2550, atk: 590, def: 205, spd: 76, crit: 10, icon: '🐚',
          skills: [{ id: 's1', name: '海洋之歌', type: 'active', effect: 'buff', cd: 4, effects: [{ type: EFFECT_TYPE.BUFF_DEF, value: 0.25 }], desc: '全体防御+25%' }] },
        { id: 'SR024', name: '森林游侠', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 2250, atk: 785, def: 155, spd: 112, crit: 21, icon: '🏹',
          skills: [{ id: 's1', name: '穿刺箭', type: 'active', damage: 1.6, cd: 3, effects: [{ type: 'damage', value: 1.6 }], desc: '160%伤害，穿透' }] },
        { id: 'SR025', name: '暗影法师', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 2150, atk: 735, def: 165, spd: 88, crit: 17, icon: '🌑',
          skills: [{ id: 's1', name: '暗影箭', type: 'active', damage: 1.45, cd: 3, effects: [{ type: 'damage', value: 1.45 }
        { id: 'SR026', name: '烈焰战士', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 4800, atk: 1120, def: 400, spd: 70, crit: 16, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR027', name: '潮汐法师', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 3520, atk: 1360, def: 288, spd: 85, crit: 18, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR028', name: '森林刺客', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 3840, atk: 1440, def: 240, spd: 110, crit: 31, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR029', name: '钢铁守卫', element: ELEMENT_TYPE.METAL, rarity: 'SR', hp: 6400, atk: 880, def: 640, spd: 50, crit: 11, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR030', name: '岩石治疗师', element: ELEMENT_TYPE.EARTH, rarity: 'SR', hp: 4160, atk: 800, def: 352, spd: 75, crit: 14, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR031', name: '圣光辅助', element: ELEMENT_TYPE.LIGHT, rarity: 'SR', hp: 4480, atk: 960, def: 400, spd: 80, crit: 16, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR032', name: '暗影战士', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 4800, atk: 1120, def: 400, spd: 70, crit: 16, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR033', name: '熔岩法师', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 3520, atk: 1360, def: 288, spd: 85, crit: 18, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR034', name: '海流刺客', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 3840, atk: 1440, def: 240, spd: 110, crit: 31, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR035', name: '藤蔓守卫', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 6400, atk: 880, def: 640, spd: 50, crit: 11, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR036', name: '利刃治疗师', element: ELEMENT_TYPE.METAL, rarity: 'SR', hp: 4160, atk: 800, def: 352, spd: 75, crit: 14, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR037', name: '大地辅助', element: ELEMENT_TYPE.EARTH, rarity: 'SR', hp: 4480, atk: 960, def: 400, spd: 80, crit: 16, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR038', name: '光明战士', element: ELEMENT_TYPE.LIGHT, rarity: 'SR', hp: 4800, atk: 1120, def: 400, spd: 70, crit: 16, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR039', name: '黑暗法师', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 3520, atk: 1360, def: 288, spd: 85, crit: 18, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR040', name: '爆炎刺客', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 3840, atk: 1440, def: 240, spd: 110, crit: 31, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR026', name: '烈焰战士', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 4800, atk: 1120, def: 400, spd: 70, crit: 16, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR027', name: '潮汐法师', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 3520, atk: 1360, def: 288, spd: 85, crit: 18, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR028', name: '森林刺客', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 3840, atk: 1440, def: 240, spd: 110, crit: 31, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR029', name: '钢铁守卫', element: ELEMENT_TYPE.METAL, rarity: 'SR', hp: 6400, atk: 880, def: 640, spd: 50, crit: 11, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR030', name: '岩石治疗师', element: ELEMENT_TYPE.EARTH, rarity: 'SR', hp: 4160, atk: 800, def: 352, spd: 75, crit: 14, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR031', name: '圣光辅助', element: ELEMENT_TYPE.LIGHT, rarity: 'SR', hp: 4480, atk: 960, def: 400, spd: 80, crit: 16, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR032', name: '暗影战士', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 4800, atk: 1120, def: 400, spd: 70, crit: 16, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR033', name: '熔岩法师', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 3520, atk: 1360, def: 288, spd: 85, crit: 18, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR034', name: '海流刺客', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 3840, atk: 1440, def: 240, spd: 110, crit: 31, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR035', name: '藤蔓守卫', element: ELEMENT_TYPE.WOOD, rarity: 'SR', hp: 6400, atk: 880, def: 640, spd: 50, crit: 11, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR036', name: '利刃治疗师', element: ELEMENT_TYPE.METAL, rarity: 'SR', hp: 4160, atk: 800, def: 352, spd: 75, crit: 14, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR037', name: '大地辅助', element: ELEMENT_TYPE.EARTH, rarity: 'SR', hp: 4480, atk: 960, def: 400, spd: 80, crit: 16, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR038', name: '光明战士', element: ELEMENT_TYPE.LIGHT, rarity: 'SR', hp: 4800, atk: 1120, def: 400, spd: 70, crit: 16, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR039', name: '黑暗法师', element: ELEMENT_TYPE.DARK, rarity: 'SR', hp: 3520, atk: 1360, def: 288, spd: 85, crit: 18, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'SR040', name: '爆炎刺客', element: ELEMENT_TYPE.FIRE, rarity: 'SR', hp: 3840, atk: 1440, def: 240, spd: 110, crit: 31, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },], desc: '145%伤害，吸血' }] }
        { id: 'SR015', name: '潮汐祭祀', element: ELEMENT_TYPE.WATER, rarity: 'SR', hp: 2500, atk: 580, def: 200, spd: 75, crit: 9, icon: '🐚',
          skills: [{ id: 's1', name: '潮汐祝福', type: SKILL_TYPE.ACTIVE, effect: 'buff', cd: 4, effects: [{ type: EFFECT_TYPE.BUFF_ATK, value: 0.2 }], desc: '全体攻击力+20%（3回合）' }] }
    ],
    R: [
        { id: 'R001', name: '赤焰', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 2200, atk: 540, def: 180, spd: 75, crit: 10, icon: '🔥',
          skills: [{ id: 's1', name: '火球术', type: SKILL_TYPE.ACTIVE, damage: 1.3, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.3 }], desc: '130%火伤害' }] },
        { id: 'R002', name: '碧波', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 1800, atk: 580, def: 140, spd: 85, crit: 8, icon: '💧',
          skills: [{ id: 's1', name: '治疗术', type: SKILL_TYPE.ACTIVE, heal: 0.2, cd: 3, effects: [{ type: EFFECT_TYPE.HEAL, value: 0.2 }], desc: '恢复20%生命' }] },
        { id: 'R003', name: '钢刃', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 2100, atk: 560, def: 200, spd: 70, crit: 10, icon: '⚔️',
          skills: [{ id: 's1', name: '斩击', type: SKILL_TYPE.ACTIVE, damage: 1.4, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.4 }], desc: '140%伤害' }] },
        { id: 'R004', name: '青藤', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 1900, atk: 420, def: 160, spd: 80, crit: 6, icon: '🌿',
          skills: [{ id: 's1', name: '缠绕', type: SKILL_TYPE.ACTIVE, damage: 1.2, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.2 }], desc: '120%伤害' }] },
        { id: 'R005', name: '岩盾', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 2600, atk: 400, def: 260, spd: 50, crit: 5, icon: '🛡️',
          skills: [{ id: 's1', name: '守护', type: SKILL_TYPE.ACTIVE, effect: 'shield', cd: 4, effects: [{ type: EFFECT_TYPE.SHIELD, value: 200 }], desc: '获得护盾' }] },
        // 新增R卡
        { id: 'R006', name: '野火法师', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 1900, atk: 520, def: 140, spd: 80, crit: 11, icon: '🔥',
          skills: [{ id: 's1', name: '火球', type: SKILL_TYPE.ACTIVE, damage: 1.35, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.35 }], desc: '135%火伤害' }] },
        { id: 'R007', name: '溪流精灵', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 1700, atk: 480, def: 130, spd: 88, crit: 9, icon: '💧',
          skills: [{ id: 's1', name: '净化', type: SKILL_TYPE.ACTIVE, heal: 0.15, cd: 3, effects: [{ type: EFFECT_TYPE.HEAL, value: 0.15 }], desc: '恢复15%生命，清除debuff' }] },
        { id: 'R008', name: '铁甲卫士', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 2400, atk: 420, def: 240, spd: 48, crit: 5, icon: '🛡️',
          skills: [{ id: 's1', name: '铁壁', type: SKILL_TYPE.ACTIVE, effect: 'shield', cd: 4, effects: [{ type: EFFECT_TYPE.SHIELD, value: 300 }], desc: '获得300点护盾' }] },
        { id: 'R009', name: '藤蔓术士', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 1800, atk: 500, def: 150, spd: 82, crit: 10, icon: '🌿',
          skills: [{ id: 's1', name: '缠绕', type: SKILL_TYPE.ACTIVE, damage: 1.1, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.1 }, { type: 'slow', value: 0.2 }], desc: '110%伤害，减速20%' }] },
        { id: 'R010', name: '岩石傀儡', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 2800, atk: 380, def: 280, spd: 42, crit: 4, icon: '🗿',
          skills: [{ id: 's1', name: '投掷', type: SKILL_TYPE.ACTIVE, damage: 1.3, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.3 }], desc: '130%伤害，50%概率眩晕' }] },
        { id: 'R011', name: '光辉牧师', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 2000, atk: 440, def: 180, spd: 72, crit: 7, icon: '✨',
          skills: [{ id: 's1', name: '祝福', type: SKILL_TYPE.ACTIVE, effect: 'buff', cd: 4, effects: [{ type: EFFECT_TYPE.BUFF_DEF, value: 0.25 }], desc: '防御+25%（3回合）' }] },
        // R级卡牌扩展2
        { id: 'R013', name: '火焰学徒', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 1950, atk: 530, def: 145, spd: 81, crit: 12, icon: '🔥',
          skills: [{ id: 's1', name: '火弹', type: 'active', damage: 1.4, cd: 3, effects: [{ type: 'damage', value: 1.4 }], desc: '140%火伤害' }] },
        { id: 'R014', name: '水元素', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 1750, atk: 490, def: 135, spd: 89, crit: 10, icon: '💧',
          skills: [{ id: 's1', name: '水疗', type: 'active', heal: 0.18, cd: 3, effects: [{ type: 'heal', value: 0.18 }], desc: '恢复18%生命' }] },
        { id: 'R015', name: '铁卫', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 2450, atk: 430, def: 245, spd: 49, crit: 6, icon: '🛡️',
          skills: [{ id: 's1', name: '铁盾', type: 'active', effect: 'shield', cd: 4, effects: [{ type: 'shield', value: 280 }], desc: '获得280护盾' }] },
        { id: 'R016', name: '自然使者', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 1850, atk: 510, def: 155, spd: 83, crit: 11, icon: '🌿',
          skills: [{ id: 's1', name: '自然之力', type: 'active', damage: 1.15, cd: 3, effects: [{ type: 'damage', value: 1.15 }], desc: '115%伤害，减速' }] },
        { id: 'R017', name: '岩石战士', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 2850, atk: 390, def: 285, spd: 43, crit: 5, icon: '🗿',
          skills: [{ id: 's1', name: '岩石冲击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害，眩晕' }] },
        { id: 'R018', name: '光明法师', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 2050, atk: 450, def: 185, spd: 73, crit: 8, icon: '✨',
          skills: [{ id: 's1', name: '光弹', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%光伤害' }] },
        { id: 'R019', name: '暗影猎手', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 1800, atk: 550, def: 125, spd: 93, crit: 17, icon: '🗡️',
          skills: [{ id: 's1', name: '暗影刺', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }] },
        { id: 'R020', name: '火焰卫士', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 2550, atk: 440, def: 255, spd: 52, crit: 7, icon: '🔥',
          skills: [{ id: 's1', name: '火盾', type: 'active', effect: 'shield', cd: 4, effects: [{ type: 'shield', value: 250 }], desc: '获得250护盾' }] },
        { id: 'R021', name: '冰霜学徒', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 1850, atk: 540, def: 155, spd: 84, crit: 11, icon: '❄️',
          skills: [{ id: 's1', name: '冰弹', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%冰伤害' }] },
        { id: 'R022', name: '森林守卫', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 2650, atk: 430, def: 265, spd: 51, crit: 6, icon: '🌲',
          skills: [{ id: 's1', name: '守护之叶', type: 'active', effect: 'shield', cd: 4, effects: [{ type: 'shield', value: 260 }], desc: '获得260护盾' }] },
        { id: 'R023', name: '雷电学徒', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 1950, atk: 550, def: 145, spd: 79, crit: 13, icon: '⚡',
          skills: [{ id: 's1', name: '电击', type: 'active', damage: 1.45, cd: 3, effects: [{ type: 'damage', value: 1.45 }], desc: '145%雷伤害' }] },
        { id: 'R024', name: '大地法师', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 2050, atk: 500, def: 195, spd: 74, crit: 9, icon: '🏔️',
          skills: [{ id: 's1', name: '土弹', type: 'active', damage: 1.3, cd: 3, effects: [{ type: 'damage', value: 1.3 }], desc: '130%土伤害' }] },
        { id: 'R025', name: '暗影术士', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 1950, atk: 530, def: 155, spd: 85, crit: 12, icon: '👻',
          skills: [{ id: 's1', name: '暗影球', type: 'active', damage: 1.4, cd: 3, effects: [{ type: 'damage', value: 1.4 }
        { id: 'R026', name: '烈焰战士', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R027', name: '潮汐法师', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R028', name: '森林刺客', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R029', name: '钢铁守卫', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R030', name: '岩石治疗师', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R031', name: '圣光辅助', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R032', name: '暗影战士', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R033', name: '熔岩法师', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R034', name: '海流刺客', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R035', name: '藤蔓守卫', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R036', name: '利刃治疗师', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R037', name: '大地辅助', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R038', name: '光明战士', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R039', name: '黑暗法师', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R040', name: '爆炎刺客', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R041', name: '冰霜守卫', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R042', name: '古树治疗师', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R043', name: '银锋辅助', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R044', name: '山岭战士', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R045', name: '闪耀法师', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R046', name: '夜幕刺客', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R047', name: '赤焰守卫', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R048', name: '流水治疗师', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R049', name: '自然辅助', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R050', name: '铁壁战士', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R051', name: '巨石法师', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R052', name: '光辉刺客', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R053', name: '深渊守卫', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R054', name: '焚天治疗师', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R055', name: '海浪辅助', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R026', name: '烈焰战士', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R027', name: '潮汐法师', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R028', name: '森林刺客', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R029', name: '钢铁守卫', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R030', name: '岩石治疗师', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R031', name: '圣光辅助', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R032', name: '暗影战士', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R033', name: '熔岩法师', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R034', name: '海流刺客', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R035', name: '藤蔓守卫', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R036', name: '利刃治疗师', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R037', name: '大地辅助', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R038', name: '光明战士', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R039', name: '黑暗法师', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R040', name: '爆炎刺客', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R041', name: '冰霜守卫', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R042', name: '古树治疗师', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R043', name: '银锋辅助', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R044', name: '山岭战士', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R045', name: '闪耀法师', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R046', name: '夜幕刺客', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R047', name: '赤焰守卫', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R048', name: '流水治疗师', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R049', name: '自然辅助', element: ELEMENT_TYPE.WOOD, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '🍃', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R050', name: '铁壁战士', element: ELEMENT_TYPE.METAL, rarity: 'R', hp: 3900, atk: 910, def: 325, spd: 70, crit: 13, icon: '⚙️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R051', name: '巨石法师', element: ELEMENT_TYPE.EARTH, rarity: 'R', hp: 2860, atk: 1105, def: 234, spd: 85, crit: 15, icon: '🏺', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R052', name: '光辉刺客', element: ELEMENT_TYPE.LIGHT, rarity: 'R', hp: 3120, atk: 1170, def: 195, spd: 110, crit: 28, icon: '🔆', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R053', name: '深渊守卫', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 5200, atk: 715, def: 520, spd: 50, crit: 8, icon: '🌙', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R054', name: '焚天治疗师', element: ELEMENT_TYPE.FIRE, rarity: 'R', hp: 3380, atk: 650, def: 286, spd: 75, crit: 11, icon: '🔥', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },
        { id: 'R055', name: '海浪辅助', element: ELEMENT_TYPE.WATER, rarity: 'R', hp: 3640, atk: 780, def: 325, spd: 80, crit: 13, icon: '❄️', skills: [{ id: 's1', name: '攻击', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%伤害' }] },], desc: '140%暗伤害' }] }
        { id: 'R012', name: '暗影刺客', element: ELEMENT_TYPE.DARK, rarity: 'R', hp: 1750, atk: 540, def: 120, spd: 92, crit: 16, icon: '🗡️',
          skills: [{ id: 's1', name: '暗影步', type: SKILL_TYPE.ACTIVE, damage: 1.45, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.45 }], desc: '145%伤害，闪避+30%' }] }
    ],
    N: [
        { id: 'N001', name: '小火灵', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 1200, atk: 380, def: 80, spd: 70, crit: 5, icon: '🔥', skills: [] },
        { id: 'N002', name: '水滴', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 1000, atk: 280, def: 90, spd: 65, crit: 4, icon: '💧', skills: [] },
        { id: 'N003', name: '铁块', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 1400, atk: 320, def: 120, spd: 55, crit: 5, icon: '⚔️', skills: [] },
        { id: 'N004', name: '树苗', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 1300, atk: 300, def: 100, spd: 60, crit: 4, icon: '🌿', skills: [] },
        { id: 'N005', name: '石块', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 1600, atk: 240, def: 160, spd: 45, crit: 3, icon: '🪨', skills: [] },
        // 新增N卡
        { id: 'N006', name: '火精灵', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 1100, atk: 340, def: 70, spd: 68, crit: 6, icon: '🔥', skills: [] },
        { id: 'N007', name: '水精灵', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 950, atk: 300, def: 85, spd: 62, crit: 5, icon: '💧', skills: [] },
        { id: 'N008', name: '金精灵', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 1300, atk: 310, def: 110, spd: 52, crit: 6, icon: '⚔️', skills: [] },
        { id: 'N009', name: '木精灵', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 1250, atk: 290, def: 95, spd: 58, crit: 5, icon: '🌿', skills: [] },
        { id: 'N010', name: '土精灵', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 1500, atk: 220, def: 150, spd: 43, crit: 4, icon: '🪨', skills: [] },
        { id: 'N011', name: '光精灵', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 1050, atk: 280, def: 80, spd: 65, crit: 5, icon: '✨', skills: [] },
        { id: 'N012', name: '暗精灵', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 1150, atk: 350, def: 75, spd: 70, crit: 7, icon: '🌑', skills: [] }
    ],

    // ==================== 批量生成卡牌 (52-100张) ====================
    N_ext: [
        { id: 'N013', name: '烈焰战士 2', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🌋', skills: [] },
        { id: 'N014', name: '海啸法师 2', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '💦', skills: [] },
        { id: 'N015', name: '叶影刺客 2', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🌿', skills: [] },
        { id: 'N016', name: '钢铁守卫 2', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🛡️', skills: [] },
        { id: 'N017', name: '大地治疗师 2', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '⛰️', skills: [] },
        { id: 'N018', name: '光明辅助 2', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🌟', skills: [] },
        { id: 'N019', name: '暗影战士 2', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🎭', skills: [] },
        { id: 'N020', name: '烈焰法师 2', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🔥', skills: [] },
        { id: 'N021', name: '流水刺客 2', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '❄️', skills: [] },
        { id: 'N022', name: '古树守卫 2', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🍃', skills: [] },
        { id: 'N023', name: '金属治疗师 2', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '⚙️', skills: [] },
        { id: 'N024', name: '大地辅助 2', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🏺', skills: [] },
        { id: 'N025', name: '圣光战士 2', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '✨', skills: [] },
        { id: 'N026', name: '暗影法师 2', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🌙', skills: [] },
        { id: 'N027', name: '火影刺客 2', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '☀️', skills: [] },
        { id: 'N028', name: '深海守卫 2', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '☔', skills: [] },
        { id: 'N029', name: '森林治疗师 2', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🌳', skills: [] },
        { id: 'N030', name: '金属辅助 2', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '⚔️', skills: [] }
        { id: 'N031', name: '烈焰战士', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🔥', skills: [] },
        { id: 'N032', name: '潮汐法师', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '❄️', skills: [] },
        { id: 'N033', name: '森林刺客', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🍃', skills: [] },
        { id: 'N034', name: '钢铁守卫', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '⚙️', skills: [] },
        { id: 'N035', name: '岩石治疗师', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🏺', skills: [] },
        { id: 'N036', name: '圣光辅助', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🔆', skills: [] },
        { id: 'N037', name: '暗影战士', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🌙', skills: [] },
        { id: 'N038', name: '熔岩法师', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🔥', skills: [] },
        { id: 'N039', name: '海流刺客', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '❄️', skills: [] },
        { id: 'N040', name: '藤蔓守卫', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🍃', skills: [] },
        { id: 'N041', name: '利刃治疗师', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '⚙️', skills: [] },
        { id: 'N042', name: '大地辅助', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🏺', skills: [] },
        { id: 'N043', name: '光明战士', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🔆', skills: [] },
        { id: 'N044', name: '黑暗法师', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🌙', skills: [] },
        { id: 'N045', name: '爆炎刺客', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🔥', skills: [] },
        { id: 'N046', name: '冰霜守卫', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '❄️', skills: [] },
        { id: 'N047', name: '古树治疗师', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🍃', skills: [] },
        { id: 'N048', name: '银锋辅助', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '⚙️', skills: [] },
        { id: 'N049', name: '山岭战士', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🏺', skills: [] },
        { id: 'N050', name: '闪耀法师', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🔆', skills: [] },
        { id: 'N051', name: '夜幕刺客', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🌙', skills: [] },
        { id: 'N052', name: '赤焰守卫', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🔥', skills: [] },
        { id: 'N053', name: '流水治疗师', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '❄️', skills: [] },
        { id: 'N054', name: '自然辅助', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🍃', skills: [] },
        { id: 'N055', name: '铁壁战士', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '⚙️', skills: [] },
        { id: 'N056', name: '巨石法师', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🏺', skills: [] },
        { id: 'N057', name: '光辉刺客', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🔆', skills: [] },
        { id: 'N058', name: '深渊守卫', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🌙', skills: [] },
        { id: 'N059', name: '焚天治疗师', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🔥', skills: [] },
        { id: 'N060', name: '海浪辅助', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '❄️', skills: [] },
        { id: 'N061', name: '荆棘战士', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🍃', skills: [] },
        { id: 'N062', name: '锋芒法师', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '⚙️', skills: [] },
        { id: 'N063', name: '岩层刺客', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🏺', skills: [] },
        { id: 'N064', name: '太阳守卫', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🔆', skills: [] },
        { id: 'N065', name: '虚空治疗师', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🌙', skills: [] },
        { id: 'N066', name: '火舞辅助', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🔥', skills: [] },
        { id: 'N067', name: '深海战士', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '❄️', skills: [] },
        { id: 'N068', name: '绿叶法师', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🍃', skills: [] },
        { id: 'N069', name: '金刚刺客', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '⚙️', skills: [] },
        { id: 'N070', name: '沙漠守卫', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🏺', skills: [] },
        { id: 'N071', name: '星辰治疗师', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🔆', skills: [] },
        { id: 'N072', name: '幽冥辅助', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🌙', skills: [] },
        { id: 'N073', name: '炎龙战士 2', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🔥', skills: [] },
        { id: 'N074', name: '冰川法师 2', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '❄️', skills: [] },
        { id: 'N075', name: '疾风刺客 2', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🍃', skills: [] },
        { id: 'N076', name: '雷霆守卫 2', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '⚙️', skills: [] },
        { id: 'N077', name: '峡谷治疗师 2', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🏺', skills: [] },
        { id: 'N078', name: '晨曦辅助 2', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🔆', skills: [] },
        { id: 'N079', name: '鬼魅战士 2', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🌙', skills: [] },
        { id: 'N080', name: '烈焰法师 2', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🔥', skills: [] },
        { id: 'N031', name: '烈焰战士', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🔥', skills: [] },
        { id: 'N032', name: '潮汐法师', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '❄️', skills: [] },
        { id: 'N033', name: '森林刺客', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🍃', skills: [] },
        { id: 'N034', name: '钢铁守卫', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '⚙️', skills: [] },
        { id: 'N035', name: '岩石治疗师', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🏺', skills: [] },
        { id: 'N036', name: '圣光辅助', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🔆', skills: [] },
        { id: 'N037', name: '暗影战士', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🌙', skills: [] },
        { id: 'N038', name: '熔岩法师', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🔥', skills: [] },
        { id: 'N039', name: '海流刺客', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '❄️', skills: [] },
        { id: 'N040', name: '藤蔓守卫', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🍃', skills: [] },
        { id: 'N041', name: '利刃治疗师', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '⚙️', skills: [] },
        { id: 'N042', name: '大地辅助', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🏺', skills: [] },
        { id: 'N043', name: '光明战士', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🔆', skills: [] },
        { id: 'N044', name: '黑暗法师', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🌙', skills: [] },
        { id: 'N045', name: '爆炎刺客', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🔥', skills: [] },
        { id: 'N046', name: '冰霜守卫', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '❄️', skills: [] },
        { id: 'N047', name: '古树治疗师', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🍃', skills: [] },
        { id: 'N048', name: '银锋辅助', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '⚙️', skills: [] },
        { id: 'N049', name: '山岭战士', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🏺', skills: [] },
        { id: 'N050', name: '闪耀法师', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🔆', skills: [] },
        { id: 'N051', name: '夜幕刺客', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🌙', skills: [] },
        { id: 'N052', name: '赤焰守卫', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🔥', skills: [] },
        { id: 'N053', name: '流水治疗师', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '❄️', skills: [] },
        { id: 'N054', name: '自然辅助', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🍃', skills: [] },
        { id: 'N055', name: '铁壁战士', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '⚙️', skills: [] },
        { id: 'N056', name: '巨石法师', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🏺', skills: [] },
        { id: 'N057', name: '光辉刺客', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🔆', skills: [] },
        { id: 'N058', name: '深渊守卫', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🌙', skills: [] },
        { id: 'N059', name: '焚天治疗师', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🔥', skills: [] },
        { id: 'N060', name: '海浪辅助', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '❄️', skills: [] },
        { id: 'N061', name: '荆棘战士', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🍃', skills: [] },
        { id: 'N062', name: '锋芒法师', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '⚙️', skills: [] },
        { id: 'N063', name: '岩层刺客', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🏺', skills: [] },
        { id: 'N064', name: '太阳守卫', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🔆', skills: [] },
        { id: 'N065', name: '虚空治疗师', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🌙', skills: [] },
        { id: 'N066', name: '火舞辅助', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🔥', skills: [] },
        { id: 'N067', name: '深海战士', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '❄️', skills: [] },
        { id: 'N068', name: '绿叶法师', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🍃', skills: [] },
        { id: 'N069', name: '金刚刺客', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '⚙️', skills: [] },
        { id: 'N070', name: '沙漠守卫', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '🏺', skills: [] },
        { id: 'N071', name: '星辰治疗师', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🔆', skills: [] },
        { id: 'N072', name: '幽冥辅助', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🌙', skills: [] },
        { id: 'N073', name: '炎龙战士 2', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🔥', skills: [] },
        { id: 'N074', name: '冰川法师 2', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '❄️', skills: [] },
        { id: 'N075', name: '疾风刺客 2', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 2400, atk: 900, def: 150, spd: 110, crit: 25, icon: '🍃', skills: [] },
        { id: 'N076', name: '雷霆守卫 2', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 4000, atk: 550, def: 400, spd: 50, crit: 5, icon: '⚙️', skills: [] },
        { id: 'N077', name: '峡谷治疗师 2', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 2600, atk: 500, def: 220, spd: 75, crit: 8, icon: '🏺', skills: [] },
        { id: 'N078', name: '晨曦辅助 2', element: ELEMENT_TYPE.LIGHT, rarity: 'N', hp: 2800, atk: 600, def: 250, spd: 80, crit: 10, icon: '🔆', skills: [] },
        { id: 'N079', name: '鬼魅战士 2', element: ELEMENT_TYPE.DARK, rarity: 'N', hp: 3000, atk: 700, def: 250, spd: 70, crit: 10, icon: '🌙', skills: [] },
        { id: 'N080', name: '烈焰法师 2', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 2200, atk: 850, def: 180, spd: 85, crit: 12, icon: '🔥', skills: [] },
    ]
};

// ==================== 等级配置 ====================
const LEVEL_CONFIG = {
    maxLevel: 70,
    maxStar: 5,
    getExpRequired: (level) => Math.floor(100 * Math.pow(1.1, level)),
    getUpgradeCost: (level) => level * 100,
    getStarUpCost: (star) => star * 1000
};

// ==================== 游戏类定义 ====================
class CardInstance {
    constructor(baseCard) {
        this.baseCard = baseCard;
        this.instanceId = Math.random().toString(36).substr(2, 9);
        this.level = 1;
        this.star = 1;
        this.exp = 0;
        this.skillCooldowns = (baseCard.skills || []).map(() => 0);
        this.buffs = [];
        this.debuffs = [];
    }

    get hp() {
        return Math.floor(this.baseCard.hp * this.getGrowthMultiplier());
    }

    get atk() {
        return Math.floor(this.baseCard.atk * this.getGrowthMultiplier());
    }

    get def() {
        return Math.floor(this.baseCard.def * this.getGrowthMultiplier());
    }

    get spd() {
        return Math.floor(this.baseCard.spd * (1 + (this.level - 1) * 0.02) * (1 + (this.star - 1) * 0.1));
    }

    get crit() {
        return Math.min(100, this.baseCard.crit + (this.star - 1) * 2);
    }

    getGrowthMultiplier() {
        const levelMult = 1 + (this.level - 1) * 0.03;
        const starMult = 1 + (this.star - 1) * 0.2;
        return levelMult * starMult;
    }

    addExp(amount) {
        this.exp += amount;
        const required = LEVEL_CONFIG.getExpRequired(this.level);
        if (this.exp >= required && this.level < LEVEL_CONFIG.maxLevel) {
            this.exp -= required;
            this.level++;
            return true;
        }
        return false;
    }

    canUpgrade() {
        return this.level < LEVEL_CONFIG.maxLevel;
    }

    canStarUp() {
        return this.star < LEVEL_CONFIG.maxStar;
    }
}

// ==================== 战斗系统 ====================
class BattleSystem {
    constructor(playerTeam, enemyTeam) {
        this.units = [];
        this.turnCount = 0;
        this.state = 'in_progress';
        
        // 创建玩家单位
        playerTeam.forEach((card, index) => {
            this.units.push(this.createBattleUnit(card, 'player', index));
        });
        
        // 创建敌方单位
        enemyTeam.forEach((card, index) => {
            this.units.push(this.createBattleUnit(card, 'enemy', index));
        });
        
        // 按速度排序
        this.sortUnitsBySpeed();
    }

    createBattleUnit(cardInstance, team, position) {
        return {
            instanceId: cardInstance.instanceId,
            cardInstance: cardInstance,
            team: team,
            position: position,
            element: cardInstance.baseCard.element,
            rarity: cardInstance.baseCard.rarity,
            currentHp: cardInstance.hp,
            maxHp: cardInstance.hp,
            currentEnergy: 0,
            maxEnergy: 100,
            buffs: [],
            debuffs: [],
            isDead: false,
            isStunned: false,
            damageDealt: 0,
            damageTaken: 0
        };
    }

    sortUnitsBySpeed() {
        this.units.sort((a, b) => b.cardInstance.spd - a.cardInstance.spd);
    }

    getAliveUnits(team) {
        return this.units.filter(u => u.team === team && !u.isDead);
    }

    calculateDamage(attacker, defender, skillMultiplier = 1.0, isCrit = false) {
        let multiplier = 1.0;
        
        // 元素克制
        if (ELEMENT_ADVANTAGE[attacker.element] === defender.element) {
            multiplier = 1.3;
        } else if (ELEMENT_ADVANTAGE[defender.element] === attacker.element) {
            multiplier = 0.7;
        }
        
        // 暴击
        if (isCrit) {
            multiplier *= 1.5;
        }
        
        // 技能倍率
        multiplier *= skillMultiplier;
        
        // Buff/Debuff影响
        const atkBuff = attacker.buffs.filter(b => b.type === EFFECT_TYPE.BUFF_ATK).reduce((sum, b) => sum + b.value, 0);
        const defBuff = defender.buffs.filter(b => b.type === EFFECT_TYPE.BUFF_DEF).reduce((sum, b) => sum + b.value, 0);
        
        const atk = attacker.cardInstance.atk * (1 + atkBuff);
        const def = defender.cardInstance.def * (1 + defBuff);
        
        const baseDamage = Math.max(1, atk - def * 0.5);
        return Math.floor(baseDamage * multiplier);
    }

    useSkill(attacker, target, skill) {
        const results = [];
        
        for (const effect of skill.effects) {
            switch (effect.type) {
                case EFFECT_TYPE.DAMAGE:
                    const isCrit = Math.random() * 100 < attacker.cardInstance.crit;
                    const damage = this.calculateDamage(attacker, target, effect.value, isCrit);
                    target.currentHp = Math.max(0, target.currentHp - damage);
                    target.damageTaken += damage;
                    attacker.damageDealt += damage;
                    
                    if (target.currentHp <= 0) {
                        target.isDead = true;
                    }
                    
                    results.push({ type: 'damage', value: damage, isCrit, target: target.cardInstance.baseCard.name });
                    break;
                    
                case EFFECT_TYPE.HEAL:
                    const healAmount = Math.floor(target.maxHp * effect.value);
                    target.currentHp = Math.min(target.maxHp, target.currentHp + healAmount);
                    results.push({ type: 'heal', value: healAmount, target: target.cardInstance.baseCard.name });
                    break;
                    
                case EFFECT_TYPE.BUFF_ATK:
                    target.buffs.push({ type: effect.type, value: effect.value, duration: 3 });
                    results.push({ type: 'buff', stat: '攻击', value: effect.value * 100 + '%' });
                    break;
                    
                case EFFECT_TYPE.BUFF_DEF:
                    target.buffs.push({ type: effect.type, value: effect.value, duration: 3 });
                    results.push({ type: 'buff', stat: '防御', value: effect.value * 100 + '%' });
                    break;
                    
                case EFFECT_TYPE.SHIELD:
                    target.buffs.push({ type: 'shield', value: effect.value, duration: 3 });
                    results.push({ type: 'shield', value: effect.value });
                    break;
                    
                case EFFECT_TYPE.TAUNT:
                    target.buffs.push({ type: 'taunt', duration: 2 });
                    results.push({ type: 'taunt' });
                    break;
            }
        }
        
        return results;
    }

    enemyAIChooseAction(enemy) {
        const playerTeam = this.getAliveUnits('player');
        if (playerTeam.length === 0) return null;
        
        // 简单AI：优先使用技能，否则普攻
        const skills = enemy.cardInstance.baseCard.skills || [];
        const availableSkill = skills.find((s, i) => 
            s.type === SKILL_TYPE.ACTIVE && enemy.cardInstance.skillCooldowns[i] === 0
        );
        
        if (availableSkill) {
            // 治疗技能优先给血量最低的友方
            if (availableSkill.effects.some(e => e.type === EFFECT_TYPE.HEAL)) {
                const allyTeam = this.getAliveUnits('enemy');
                const lowestHp = allyTeam.sort((a, b) => a.currentHp / a.maxHp - b.currentHp / b.maxHp)[0];
                return { skill: availableSkill, target: lowestHp };
            }
            
            // 攻击技能随机选择目标
            const target = playerTeam[Math.floor(Math.random() * playerTeam.length)];
            return { skill: availableSkill, target };
        }
        
        // 普攻
        const target = playerTeam[Math.floor(Math.random() * playerTeam.length)];
        return { skill: { name: '普攻', effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.0 }] }, target };
    }

    checkBattleEnd() {
        const playerAlive = this.getAliveUnits('player').length;
        const enemyAlive = this.getAliveUnits('enemy').length;
        
        if (enemyAlive === 0) return 'player_win';
        if (playerAlive === 0) return 'enemy_win';
        return null;
    }
}

// ==================== 工具函数 ====================
function drawCardFromDatabase() {
    const rarities = ['N', 'N', 'N', 'R', 'R', 'SR', 'SSR'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const cards = CARD_DATABASE[rarity];
    const baseCard = cards[Math.floor(Math.random() * cards.length)];
    return new CardInstance(baseCard);
}

function calculateDamage(attacker, defender, isCrit = false, skillMultiplier = 1.0) {
    let multiplier = 1.0;
    
    if (ELEMENT_ADVANTAGE[attacker.element] === defender.element) {
        multiplier = 1.3;
    } else if (ELEMENT_ADVANTAGE[defender.element] === attacker.element) {
        multiplier = 0.7;
    }
    
    if (isCrit) multiplier *= 1.5;
    multiplier *= skillMultiplier;
    
    const baseDamage = Math.max(1, attacker.atk - defender.def * 0.5);
    return Math.floor(baseDamage * multiplier);
}

// ==================== 导出 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        CARD_DATABASE, CardInstance, BattleSystem, 
        ELEMENT_TYPE, RARITY, ELEMENT_ADVANTAGE, ELEMENT_DATA,
        SKILL_TYPE, EFFECT_TYPE, LEVEL_CONFIG,
        drawCardFromDatabase, calculateDamage
    };
}
