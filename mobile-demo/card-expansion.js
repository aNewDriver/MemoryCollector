// 记忆回收者 - 扩展卡牌数据库 v0.6
// 目标：50+张卡牌，每张都有独特技能和定位

// ==================== 新增SSR卡牌 ====================
const NEW_SSR_CARDS = [
    {
        id: 'SSR007',
        name: '风语者',
        element: 'wood',
        rarity: 'SSR',
        hp: 2700,
        atk: 890,
        def: 240,
        spd: 120,
        crit: 20,
        icon: '🌪️',
        role: 'assassin',
        skills: [
            { id: 's1', name: '疾风步', type: 'active', damage: 1.6, target: 'single', cd: 2, 
              effects: [{ type: 'damage', value: 1.6 }, { type: 'buff_spd', value: 0.3 }], 
              desc: '160%伤害，自身速度+30%（3回合）' },
            { id: 'p1', name: '风之痕', type: 'passive', 
              effects: [{ type: 'extra_turn', chance: 0.2 }], 
              desc: '20%概率额外行动一次' }
        ],
        description: '如风般迅捷的刺客，在敌人反应过来之前就已结束战斗。'
    },
    {
        id: 'SSR008',
        name: '雷霆裁决',
        element: 'metal',
        rarity: 'SSR',
        hp: 3200,
        atk: 950,
        def: 300,
        spd: 70,
        crit: 15,
        icon: '⚡',
        role: 'warrior',
        skills: [
            { id: 's1', name: '雷霆一击', type: 'active', damage: 2.2, target: 'single', cd: 4, 
              effects: [{ type: 'damage', value: 2.2 }, { type: 'stun', chance: 0.5 }], 
              desc: '220%伤害，50%概率眩晕（1回合）' },
            { id: 's2', name: '闪电链', type: 'active', damage: 1.0, target: 'all', cd: 5, 
              effects: [{ type: 'damage', value: 1.0 }], 
              desc: '全体100%雷属性伤害' }
        ],
        description: '执掌雷霆的裁决者，以天罚之力审判敌人。'
    },
    {
        id: 'SSR009',
        name: '生命之树',
        element: 'wood',
        rarity: 'SSR',
        hp: 3800,
        atk: 520,
        def: 350,
        spd: 60,
        crit: 8,
        icon: '🌳',
        role: 'healer',
        skills: [
            { id: 's1', name: '生命绽放', type: 'active', heal: 0.35, target: 'all', cd: 4, 
              effects: [{ type: 'heal', value: 0.35 }], 
              desc: '全体恢复35%生命' },
            { id: 'p1', name: '自然守护', type: 'passive', 
              effects: [{ type: 'regen', value: 0.05 }], 
              desc: '每回合开始时，全体恢复5%生命' }
        ],
        description: '生命之树的化身，带来生生不息的治愈之力。'
    },
    {
        id: 'SSR010',
        name: '虚空行者',
        element: 'dark',
        rarity: 'SSR',
        hp: 2500,
        atk: 920,
        def: 200,
        spd: 100,
        crit: 22,
        icon: '🌌',
        role: 'mage',
        skills: [
            { id: 's1', name: '虚空裂隙', type: 'active', damage: 1.8, target: 'single', cd: 3, 
              effects: [{ type: 'damage', value: 1.8 }, { type: 'debuff_def', value: 0.3 }], 
              desc: '180%伤害，降低目标30%防御（2回合）' },
            { id: 's2', name: '维度穿梭', type: 'active', effect: 'invincible', target: 'self', cd: 6, 
              effects: [{ type: 'invincible', duration: 1 }], 
              desc: '下回合免疫所有伤害' }
        ],
        description: '行走于虚空与现实之间的神秘法师。'
    },
    {
        id: 'SSR011',
        name: '太阳神官',
        element: 'light',
        rarity: 'SSR',
        hp: 3100,
        atk: 680,
        def: 280,
        spd: 80,
        crit: 12,
        icon: '☀️',
        role: 'support',
        skills: [
            { id: 's1', name: '神圣庇护', type: 'active', effect: 'shield', target: 'all', cd: 4, 
              effects: [{ type: 'shield', value: 0.2 }], 
              desc: '全体获得20%最大生命的护盾' },
            { id: 'p1', name: '日光普照', type: 'passive', 
              effects: [{ type: 'buff_atk', value: 0.1 }], 
              desc: '全体友方攻击力+10%' }
        ],
        description: '太阳的使者，以光明之力庇护同伴。'
    },
    {
        id: 'SSR012',
        name: '深渊吞噬者',
        element: 'water',
        rarity: 'SSR',
        hp: 3600,
        atk: 780,
        def: 320,
        spd: 55,
        crit: 10,
        icon: '🌊',
        role: 'tank',
        skills: [
            { id: 's1', name: '深渊之口', type: 'active', damage: 1.4, target: 'all', cd: 4, 
              effects: [{ type: 'damage', value: 1.4 }, { type: 'taunt', duration: 2 }], 
              desc: '全体140%伤害，嘲讽（2回合）' },
            { id: 'p1', name: '深海之力', type: 'passive', 
              effects: [{ type: 'hp_regen', value: 0.08 }], 
              desc: '每回合恢复8%最大生命' }
        ],
        description: '来自深渊的古老存在，吞噬一切敢于挑战者。'
    }
];

// ==================== 新增SR卡牌 ====================
const NEW_SR_CARDS = [
    {
        id: 'SR008',
        name: '暴风射手',
        element: 'wood',
        rarity: 'SR',
        hp: 2300,
        atk: 760,
        def: 170,
        spd: 105,
        crit: 18,
        icon: '🏹',
        skills: [
            { id: 's1', name: '连射', type: 'active', damage: 0.9, target: 'random', cd: 2, 
              effects: [{ type: 'damage', value: 0.9, hits: 3 }], 
              desc: '随机射击3次，每次90%伤害' }
        ]
    },
    {
        id: 'SR009',
        name: '岩浆巨人',
        element: 'fire',
        rarity: 'SR',
        hp: 3600,
        atk: 580,
        def: 360,
        spd: 45,
        crit: 6,
        icon: '🌋',
        skills: [
            { id: 's1', name: '岩浆喷发', type: 'active', damage: 1.3, target: 'single', cd: 3, 
              effects: [{ type: 'damage', value: 1.3 }, { type: 'burn', value: 0.1, duration: 3 }], 
              desc: '130%伤害，附加灼烧（每回合10%伤害，3回合）' }
        ]
    },
    {
        id: 'SR010',
        name: '霜冻法师',
        element: 'water',
        rarity: 'SR',
        hp: 2100,
        atk: 720,
        def: 160,
        spd: 85,
        crit: 12,
        icon: '❄️',
        skills: [
            { id: 's1', name: '冰霜新星', type: 'active', damage: 1.1, target: 'all', cd: 4, 
              effects: [{ type: 'damage', value: 1.1 }, { type: 'freeze', chance: 0.3 }], 
              desc: '全体110%伤害，30%概率冰冻（1回合）' }
        ]
    },
    {
        id: 'SR011',
        name: '圣骑士',
        element: 'light',
        rarity: 'SR',
        hp: 3300,
        atk: 620,
        def: 300,
        spd: 60,
        crit: 8,
        icon: '⚜️',
        skills: [
            { id: 's1', name: '圣光斩', type: 'active', damage: 1.4, target: 'single', cd: 3, 
              effects: [{ type: 'damage', value: 1.4 }, { type: 'heal', value: 0.15 }], 
              desc: '140%伤害，恢复15%伤害值的生命' }
        ]
    },
    {
        id: 'SR012',
        name: '影舞者',
        element: 'dark',
        rarity: 'SR',
        hp: 2200,
        atk: 790,
        def: 150,
        spd: 115,
        crit: 25,
        icon: '🎭',
        skills: [
            { id: 's1', name: '影分身', type: 'active', damage: 1.2, target: 'single', cd: 3, 
              effects: [{ type: 'damage', value: 1.2 }, { type: 'dodge', value: 0.5, duration: 2 }], 
              desc: '120%伤害，闪避率+50%（2回合）' }
        ]
    },
    {
        id: 'SR013',
        name: '沙漠守护者',
        element: 'earth',
        rarity: 'SR',
        hp: 3100,
        atk: 560,
        def: 330,
        spd: 50,
        crit: 7,
        icon: '🏺',
        skills: [
            { id: 's1', name: '沙尘暴', type: 'active', damage: 1.0, target: 'all', cd: 4, 
              effects: [{ type: 'damage', value: 1.0 }, { type: 'debuff_acc', value: 0.3 }], 
              desc: '全体100%伤害，降低30%命中率（2回合）' }
        ]
    },
    {
        id: 'SR014',
        name: '雷霆战锤',
        element: 'metal',
        rarity: 'SR',
        hp: 2900,
        atk: 700,
        def: 260,
        spd: 65,
        crit: 14,
        icon: '🔨',
        skills: [
            { id: 's1', name: '雷霆猛击', type: 'active', damage: 1.7, target: 'single', cd: 3, 
              effects: [{ type: 'damage', value: 1.7 }], 
              desc: '170%伤害，无视20%防御' }
        ]
    },
    {
        id: 'SR015',
        name: '潮汐祭祀',
        element: 'water',
        rarity: 'SR',
        hp: 2500,
        atk: 580,
        def: 200,
        spd: 75,
        crit: 9,
        icon: '🐚',
        skills: [
            { id: 's1', name: '潮汐祝福', type: 'active', effect: 'buff', target: 'all', cd: 4, 
              effects: [{ type: 'buff_atk', value: 0.2, duration: 3 }], 
              desc: '全体攻击力+20%（3回合）' }
        ]
    }
];

// ==================== 新增R卡牌 ====================
const NEW_R_CARDS = [
    { id: 'R006', name: '野火法师', element: 'fire', rarity: 'R', hp: 1900, atk: 520, def: 140, spd: 80, crit: 11, icon: '🔥',
      skills: [{ id: 's1', name: '火球', type: 'active', damage: 1.35, cd: 3, effects: [{ type: 'damage', value: 1.35 }], desc: '135%火伤害' }] },
    { id: 'R007', name: '溪流精灵', element: 'water', rarity: 'R', hp: 1700, atk: 480, def: 130, spd: 88, crit: 9, icon: '💧',
      skills: [{ id: 's1', name: '净化', type: 'active', heal: 0.15, cd: 3, effects: [{ type: 'heal', value: 0.15 }], desc: '恢复15%生命，清除debuff' }] },
    { id: 'R008', name: '铁甲卫士', element: 'metal', rarity: 'R', hp: 2400, atk: 420, def: 240, spd: 48, crit: 5, icon: '🛡️',
      skills: [{ id: 's1', name: '铁壁', type: 'active', effect: 'shield', cd: 4, effects: [{ type: 'shield', value: 300 }], desc: '获得300点护盾' }] },
    { id: 'R009', name: '藤蔓术士', element: 'wood', rarity: 'R', hp: 1800, atk: 500, def: 150, spd: 82, crit: 10, icon: '🌿',
      skills: [{ id: 's1', name: '缠绕', type: 'active', damage: 1.1, cd: 3, effects: [{ type: 'damage', value: 1.1 }, { type: 'slow', value: 0.2 }], desc: '110%伤害，减速20%' }] },
    { id: 'R010', name: '岩石傀儡', element: 'earth', rarity: 'R', hp: 2800, atk: 380, def: 280, spd: 42, crit: 4, icon: '🗿',
      skills: [{ id: 's1', name: '投掷', type: 'active', damage: 1.3, cd: 3, effects: [{ type: 'damage', value: 1.3 }], desc: '130%伤害，50%概率眩晕' }] },
    { id: 'R011', name: '光辉牧师', element: 'light', rarity: 'R', hp: 2000, atk: 440, def: 180, spd: 72, crit: 7, icon: '✨',
      skills: [{ id: 's1', name: '祝福', type: 'active', effect: 'buff', cd: 4, effects: [{ type: 'buff_def', value: 0.25 }], desc: '防御+25%（3回合）' }] },
    { id: 'R012', name: '暗影刺客', element: 'dark', rarity: 'R', hp: 1750, atk: 540, def: 120, spd: 92, crit: 16, icon: '🗡️',
      skills: [{ id: 's1', name: '暗影步', type: 'active', damage: 1.45, cd: 3, effects: [{ type: 'damage', value: 1.45 }], desc: '145%伤害，闪避+30%' }] }
];

// ==================== 新增N卡牌 ====================
const NEW_N_CARDS = [
    { id: 'N006', name: '火精灵', element: 'fire', rarity: 'N', hp: 1100, atk: 340, def: 70, spd: 68, crit: 6, icon: '🔥', skills: [] },
    { id: 'N007', name: '水精灵', element: 'water', rarity: 'N', hp: 950, atk: 300, def: 85, spd: 62, crit: 5, icon: '💧', skills: [] },
    { id: 'N008', name: '金精灵', element: 'metal', rarity: 'N', hp: 1300, atk: 310, def: 110, spd: 52, crit: 6, icon: '⚔️', skills: [] },
    { id: 'N009', name: '木精灵', element: 'wood', rarity: 'N', hp: 1250, atk: 290, def: 95, spd: 58, crit: 5, icon: '🌿', skills: [] },
    { id: 'N010', name: '土精灵', element: 'earth', rarity: 'N', hp: 1500, atk: 220, def: 150, spd: 43, crit: 4, icon: '🪨', skills: [] },
    { id: 'N011', name: '光精灵', element: 'light', rarity: 'N', hp: 1050, atk: 280, def: 80, spd: 65, crit: 5, icon: '✨', skills: [] },
    { id: 'N012', name: '暗精灵', element: 'dark', rarity: 'N', hp: 1150, atk: 350, def: 75, spd: 70, crit: 7, icon: '🌑', skills: [] }
];

// 合并到主数据库的函数
function expandCardDatabase() {
    if (typeof CARD_DATABASE !== 'undefined') {
        CARD_DATABASE.SSR.push(...NEW_SSR_CARDS);
        CARD_DATABASE.SR.push(...NEW_SR_CARDS);
        CARD_DATABASE.R.push(...NEW_R_CARDS);
        CARD_DATABASE.N.push(...NEW_N_CARDS);
        console.log('[CardExpansion] 卡牌库已扩展，当前共', 
            CARD_DATABASE.SSR.length + CARD_DATABASE.SR.length + 
            CARD_DATABASE.R.length + CARD_DATABASE.N.length, '张卡牌');
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        NEW_SSR_CARDS, 
        NEW_SR_CARDS, 
        NEW_R_CARDS, 
        NEW_N_CARDS,
        expandCardDatabase 
    };
} else {
    // 浏览器环境自动扩展
    expandCardDatabase();
}
