/**
 * 卡牌批量生成器
 * 目标：500张独特卡牌
 */

// 卡牌名称库
const CARD_NAMES = {
    fire: {
        warrior: ['烈焰剑士', '火舞战将', '熔岩勇士', '炎龙骑士', '爆炎战士', '赤焰狂徒', '焚天武士'],
        mage: ['火元素师', '烈焰法师', '岩浆术士', '炎爆巫师', '凤凰召唤师', '灼烧术士'],
        assassin: ['火影刺客', '烈焰盗贼', '熔岩杀手', '爆炎行者', '余烬刺客'],
        tank: ['熔岩巨像', '火焰守卫', '炎甲卫士', '熔火泰坦', '烈焰壁垒'],
        healer: ['温暖之灵', '治愈火焰', '生命之火', ' flame牧师', '温热治愈'],
        support: ['火焰增益者', '燃烧辅助', '烈焰助威', '火种传递']
    },
    water: {
        warrior: ['潮汐战士', '海流剑士', '冰霜武士', '流水战将', '海浪骑士'],
        mage: ['海啸法师', '冰霜巫师', '流水术士', '寒冰元素师', '漩涡召唤师'],
        assassin: ['流水刺客', '冰霜杀手', '潮汐行者', '海流盗贼'],
        tank: ['深海巨兽', '冰川守卫', '潮汐壁垒', '寒冰护盾'],
        healer: ['治愈之泉', '生命水流', '温暖海洋', '潮汐治愈'],
        support: ['水流增益', '冰霜护盾', '潮汐祝福', '海洋之歌']
    },
    wood: {
        warrior: ['森林战士', '藤蔓剑士', '古树武士', '自然战将', '荆棘骑士'],
        mage: ['自然法师', '森林巫师', '荆棘术士', '生命元素师', '种子召唤师'],
        assassin: ['叶影刺客', '荆棘杀手', '藤蔓行者', '森林盗贼'],
        tank: ['古树守卫', '森林壁垒', '荆棘护盾', '自然巨像'],
        healer: ['治愈之叶', '生命之花', '森林治愈', '自然牧师'],
        support: ['自然增益', '森林护盾', '生长祝福', '藤蔓缠绕']
    },
    metal: {
        warrior: ['钢铁战士', '利刃剑士', '金属武士', '银锋战将', '铁壁骑士'],
        mage: ['炼金法师', '金属巫师', '锋利术士', '刃舞元素师'],
        assassin: ['银刃刺客', '金属杀手', '利刃行者', '锋芒盗贼'],
        tank: ['钢铁巨像', '金属守卫', '利刃壁垒', '银盾卫士'],
        healer: ['治愈金属', '生命合金', '温暖钢铁', '修复之光'],
        support: ['金属增益', '钢铁护盾', '锋利祝福', '强化合金']
    },
    earth: {
        warrior: ['岩石战士', '大地剑士', '山岭武士', '巨石战将', '岩层骑士'],
        mage: ['大地法师', '岩石巫师', '山岭术士', '地震元素师', '岩浆召唤师'],
        assassin: ['岩石刺客', '大地杀手', '山岭行者', '巨石盗贼'],
        tank: ['岩石巨像', '大地守卫', '山岭壁垒', '岩浆护盾'],
        healer: ['治愈大地', '生命岩石', '温暖土壤', '大地治愈'],
        support: ['大地增益', '岩石护盾', '山岭祝福', '稳固之土']
    },
    light: {
        warrior: ['圣光战士', '光明剑士', '闪耀武士', '光辉战将', '太阳骑士'],
        mage: ['光明法师', '圣光巫师', '闪耀术士', '太阳元素师', '星光召唤师'],
        assassin: ['光刃刺客', '闪耀杀手', '光明行者', '光辉盗贼'],
        tank: ['圣光守卫', '光明壁垒', '闪耀护盾', '太阳卫士'],
        healer: ['治愈之光', '生命光辉', '温暖阳光', '圣光治愈'],
        support: ['光明增益', '圣光护盾', '光辉祝福', '太阳之歌']
    },
    dark: {
        warrior: ['暗影战士', '黑暗剑士', '夜幕武士', '深渊战将', '虚空骑士'],
        mage: ['暗影法师', '黑暗巫师', '夜幕术士', '虚空元素师', '深渊召唤师'],
        assassin: ['暗夜刺客', '阴影杀手', '虚空行者', '夜幕盗贼'],
        tank: ['暗影守卫', '黑暗壁垒', '夜幕护盾', '虚空卫士'],
        healer: ['暗影治愈', '生命汲取', '温暖黑暗', '夜幕治愈'],
        support: ['暗影增益', '黑暗护盾', '虚空祝福', '夜幕之歌']
    }
};

// 技能库
const SKILL_LIBRARY = {
    damage: {
        single_high: { name: '重击', multiplier: 1.8, cd: 3, desc: '180%伤害' },
        single_medium: { name: '斩击', multiplier: 1.4, cd: 2, desc: '140%伤害' },
        aoe_low: { name: '旋风斩', multiplier: 1.0, cd: 4, desc: '全体100%伤害' },
        aoe_medium: { name: '爆裂', multiplier: 1.3, cd: 5, desc: '全体130%伤害' },
        multi_hit: { name: '连击', multiplier: 0.9, hits: 3, cd: 3, desc: '3次90%伤害' },
        penetrate: { name: '穿透', multiplier: 1.6, cd: 3, desc: '160%伤害，无视防御' },
        execute: { name: '处决', multiplier: 2.0, cd: 4, desc: '200%伤害，目标低于30%时暴击' }
    },
    heal: {
        single_small: { name: '治疗', amount: 0.2, cd: 3, desc: '恢复20%生命' },
        single_medium: { name: '治愈', amount: 0.35, cd: 4, desc: '恢复35%生命' },
        aoe_small: { name: '群体治疗', amount: 0.15, cd: 4, desc: '全体恢复15%生命' },
        aoe_medium: { name: '圣疗', amount: 0.25, cd: 5, desc: '全体恢复25%生命' },
        regen: { name: '再生', amount: 0.08, cd: 4, desc: '每回合恢复8%生命（3回合）' }
    },
    buff: {
        atk_up: { name: '战意', value: 0.25, duration: 3, cd: 4, desc: '攻击+25%（3回合）' },
        def_up: { name: '铁壁', value: 0.3, duration: 3, cd: 4, desc: '防御+30%（3回合）' },
        spd_up: { name: '疾风', value: 0.2, duration: 3, cd: 4, desc: '速度+20%（3回合）' },
        crit_up: { name: '专注', value: 0.15, duration: 3, cd: 4, desc: '暴击+15%（3回合）' }
    },
    debuff: {
        atk_down: { name: '虚弱', value: 0.2, duration: 3, cd: 3, desc: '降低攻击20%（3回合）' },
        def_down: { name: '破甲', value: 0.3, duration: 3, cd: 3, desc: '降低防御30%（3回合）' },
        spd_down: { name: '减速', value: 0.25, duration: 3, cd: 3, desc: '降低速度25%（3回合）' }
    },
    control: {
        stun: { name: '眩晕', chance: 0.5, duration: 1, cd: 4, desc: '50%概率眩晕（1回合）' },
        freeze: { name: '冰冻', chance: 0.4, duration: 1, cd: 4, desc: '40%概率冰冻（1回合）' },
        taunt: { name: '嘲讽', duration: 2, cd: 4, desc: '强制敌人攻击自己（2回合）' },
        silence: { name: '沉默', duration: 2, cd: 5, desc: '无法使用技能（2回合）' }
    },
    special: {
        shield: { name: '护盾', value: 300, cd: 4, desc: '获得300点护盾' },
        aoe_shield: { name: '群体护盾', value: 0.15, cd: 5, desc: '全体获得15%生命护盾' },
        revive: { name: '复活', hp: 0.3, cd: 6, desc: '复活队友30%生命' },
        lifesteal: { name: '吸血', value: 0.15, desc: '造成伤害的15%转化为生命' },
        extra_turn: { name: '迅捷', chance: 0.2, desc: '20%概率额外行动' },
        counter: { name: '反击', chance: 0.3, desc: '30%概率反击' }
    }
};

// 图标库
const ICONS = {
    fire: ['🔥', '🔆', '☀️', '🌋', '💥', '⚡'],
    water: ['💧', '❄️', '🌊', '☔', '💦', '🐟'],
    wood: ['🌿', '🌲', '🍃', '🌱', '🌳', '🎋'],
    metal: ['⚔️', '🛡️', '🔨', '⚙️', '🔱', '🗡️'],
    earth: ['🏔️', '🪨', '⛰️', '🗿', '🏛️', '🏺'],
    light: ['✨', '⭐', '☀️', '🌟', '💫', '🔆'],
    dark: ['🌑', '🌙', '🌌', '👻', '🎭', '🌚']
};

// 生成卡牌ID
function generateCardId(rarity, index) {
    const prefix = { N: 'N', R: 'R', SR: 'SR', SSR: 'SSR', UR: 'UR' }[rarity];
    return `${prefix}${String(index).padStart(3, '0')}`;
}

// 随机选择
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 生成卡牌数据
function generateCard(rarity, element, role, index) {
    const id = generateCardId(rarity, index);
    const name = randomChoice(CARD_NAMES[element][role]);
    const icon = randomChoice(ICONS[element]);
    
    // 基础属性（根据稀有度和职业）
    const baseStats = calculateBaseStats(rarity, role);
    
    // 生成技能
    const skills = generateSkills(rarity, role, element);
    
    return {
        id,
        name,
        element,
        role,
        rarity,
        ...baseStats,
        icon,
        skills,
        description: generateDescription(name, role, element)
    };
}

// 计算基础属性
function calculateBaseStats(rarity, role) {
    const multipliers = {
        N: 1.0,
        R: 1.3,
        SR: 1.6,
        SSR: 2.0,
        UR: 2.5
    };
    
    const roleStats = {
        warrior: { hp: 3000, atk: 700, def: 250, spd: 70, crit: 10 },
        mage: { hp: 2200, atk: 850, def: 180, spd: 85, crit: 12 },
        assassin: { hp: 2400, atk: 900, def: 150, spd: 110, crit: 25 },
        tank: { hp: 4000, atk: 550, def: 400, spd: 50, crit: 5 },
        healer: { hp: 2600, atk: 500, def: 220, spd: 75, crit: 8 },
        support: { hp: 2800, atk: 600, def: 250, spd: 80, crit: 10 }
    };
    
    const base = roleStats[role];
    const mult = multipliers[rarity];
    
    return {
        hp: Math.floor(base.hp * mult),
        atk: Math.floor(base.atk * mult),
        def: Math.floor(base.def * mult),
        spd: Math.floor(base.spd * (rarity === 'SSR' || rarity === 'UR' ? 1.1 : 1)),
        crit: Math.min(50, base.crit + (multipliers[rarity] - 1) * 10)
    };
}

// 生成技能
function generateSkills(rarity, role, element) {
    const skills = [];
    
    // 根据职业选择技能类型
    const skillPool = [];
    
    switch (role) {
        case 'warrior':
            skillPool.push(
                randomChoice(Object.values(SKILL_LIBRARY.damage)),
                randomChoice([SKILL_LIBRARY.buff.atk_up, SKILL_LIBRARY.special.counter])
            );
            break;
        case 'mage':
            skillPool.push(
                randomChoice([...Object.values(SKILL_LIBRARY.damage), SKILL_LIBRARY.damage.aoe_medium]),
                randomChoice([SKILL_LIBRARY.debuff.def_down, SKILL_LIBRARY.control.stun])
            );
            break;
        case 'assassin':
            skillPool.push(
                randomChoice([SKILL_LIBRARY.damage.penetrate, SKILL_LIBRARY.damage.multi_hit]),
                randomChoice([SKILL_LIBRARY.buff.spd_up, SKILL_LIBRARY.special.extra_turn])
            );
            break;
        case 'tank':
            skillPool.push(
                randomChoice([SKILL_LIBRARY.control.taunt, SKILL_LIBRARY.buff.def_up]),
                randomChoice([SKILL_LIBRARY.special.shield, SKILL_LIBRARY.special.counter])
            );
            break;
        case 'healer':
            skillPool.push(
                randomChoice([...Object.values(SKILL_LIBRARY.heal)]),
                randomChoice([SKILL_LIBRARY.buff.def_up, SKILL_LIBRARY.special.regen])
            );
            break;
        case 'support':
            skillPool.push(
                randomChoice([SKILL_LIBRARY.buff.atk_up, SKILL_LIBRARY.special.aoe_shield]),
                randomChoice([SKILL_LIBRARY.debuff.atk_down, SKILL_LIBRARY.control.silence])
            );
            break;
    }
    
    // 根据稀有度决定技能数量
    const skillCount = { N: 0, R: 1, SR: 1, SSR: 2, UR: 3 }[rarity];
    
    for (let i = 0; i < skillCount; i++) {
        if (skillPool[i]) {
            skills.push({
                id: `s${i + 1}`,
                ...skillPool[i]
            });
        }
    }
    
    return skills;
}

// 生成背景故事
function generateDescription(name, role, element) {
    const elementDesc = {
        fire: '火焰',
        water: '水流',
        wood: '自然',
        metal: '金属',
        earth: '大地',
        light: '光明',
        dark: '暗影'
    };
    
    const roleDesc = {
        warrior: '战士',
        mage: '法师',
        assassin: '刺客',
        tank: '守护者',
        healer: '治疗师',
        support: '辅助者'
    };
    
    return `${elementDesc[element]}之力的${roleDesc[role]}，${name}在战场上展现独特的能力。`;
}

// 批量生成卡牌
function batchGenerateCards(count, rarity, element, role, startIndex) {
    const cards = [];
    for (let i = 0; i < count; i++) {
        cards.push(generateCard(rarity, element, role, startIndex + i));
    }
    return cards;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateCard,
        batchGenerateCards,
        CARD_NAMES,
        SKILL_LIBRARY,
        ICONS
    };
}

console.log('[CardGenerator] 卡牌生成器已加载');
console.log('[CardGenerator] 使用方法：generateCard(rarity, element, role, index)');
console.log('[CardGenerator] 示例：generateCard("SR", "fire", "warrior", 16)');
