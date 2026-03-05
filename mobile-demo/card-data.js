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
          skills: [{ id: 's1', name: '暗影突袭', type: SKILL_TYPE.ACTIVE, damage: 1.6, cd: 3, effects: [{ type: EFFECT_TYPE.DAMAGE, value: 1.6 }], desc: '160%伤害' }] }
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
          skills: [{ id: 's1', name: '守护', type: SKILL_TYPE.ACTIVE, effect: 'shield', cd: 4, effects: [{ type: EFFECT_TYPE.SHIELD, value: 200 }], desc: '获得护盾' }] }
    ],
    N: [
        { id: 'N001', name: '小火灵', element: ELEMENT_TYPE.FIRE, rarity: 'N', hp: 1200, atk: 380, def: 80, spd: 70, crit: 5, icon: '🔥', skills: [] },
        { id: 'N002', name: '水滴', element: ELEMENT_TYPE.WATER, rarity: 'N', hp: 1000, atk: 280, def: 90, spd: 65, crit: 4, icon: '💧', skills: [] },
        { id: 'N003', name: '铁块', element: ELEMENT_TYPE.METAL, rarity: 'N', hp: 1400, atk: 320, def: 120, spd: 55, crit: 5, icon: '⚔️', skills: [] },
        { id: 'N004', name: '树苗', element: ELEMENT_TYPE.WOOD, rarity: 'N', hp: 1300, atk: 300, def: 100, spd: 60, crit: 4, icon: '🌿', skills: [] },
        { id: 'N005', name: '石块', element: ELEMENT_TYPE.EARTH, rarity: 'N', hp: 1600, atk: 240, def: 160, spd: 45, crit: 3, icon: '🪨', skills: [] }
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
