// 继续生成卡牌达到100张
// 当前：69张，目标：100张，还需：31张

const fs = require('fs');

// 读取当前文件
let content = fs.readFileSync('card-data.js', 'utf8');

// 生成更多SR卡 (10张，达到25张)
const newSR = `
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
          skills: [{ id: 's1', name: '暗影箭', type: 'active', damage: 1.45, cd: 3, effects: [{ type: 'damage', value: 1.45 }], desc: '145%伤害，吸血' }] }
`;

// 生成更多R卡 (13张，达到25张)
const newR = `
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
          skills: [{ id: 's1', name: '暗影球', type: 'active', damage: 1.4, cd: 3, effects: [{ type: 'damage', value: 1.4 }], desc: '140%暗伤害' }] }
`;

// 生成更多SSR卡 (8张，达到20张)
const newSSR = `
        // SSR级卡牌扩展
        { id: 'SSR013', name: '风神', element: ELEMENT_TYPE.WOOD, rarity: 'SSR', hp: 2750, atk: 900, def: 245, spd: 125, crit: 21, icon: '🌪️',
          skills: [{ id: 's1', name: '风神斩', type: 'active', damage: 1.85, cd: 3, effects: [{ type: 'damage', value: 1.85 }], desc: '185%伤害，全体加速' }, { id: 'p1', name: '风之祝福', type: 'passive', effects: [{ type: 'buff_spd', value: 0.15 }], desc: '全体速度+15%' }] },
        { id: 'SSR014', name: '雷神', element: ELEMENT_TYPE.METAL, rarity: 'SSR', hp: 3250, atk: 960, def: 305, spd: 72, crit: 16, icon: '⚡',
          skills: [{ id: 's1', name: '雷神之怒', type: 'active', damage: 2.3, cd: 4, effects: [{ type: 'damage', value: 2.3 }], desc: '230%伤害，眩晕' }, { id: 's2', name: '雷霆万钧', type: 'active', damage: 1.1, cd: 5, effects: [{ type: 'damage', value: 1.1 }], desc: '全体110%雷伤害' }] },
        { id: 'SSR015', name: '世界树', element: ELEMENT_TYPE.WOOD, rarity: 'SSR', hp: 3900, atk: 530, def: 355, spd: 61, crit: 9, icon: '🌳',
          skills: [{ id: 's1', name: '生命之光', type: 'active', heal: 0.4, cd: 4, effects: [{ type: 'heal', value: 0.4 }], desc: '全体恢复40%生命' }, { id: 'p1', name: '永恒生命', type: 'passive', effects: [{ type: 'regen', value: 0.06 }], desc: '每回合恢复6%生命' }] },
        { id: 'SSR016', name: '虚空领主', element: ELEMENT_TYPE.DARK, rarity: 'SSR', hp: 2550, atk: 930, def: 205, spd: 102, crit: 23, icon: '🌌',
          skills: [{ id: 's1', name: '虚空吞噬', type: 'active', damage: 1.9, cd: 3, effects: [{ type: 'damage', value: 1.9 }], desc: '190%伤害，降防' }, { id: 's2', name: '虚空护盾', type: 'active', effect: 'invincible', cd: 6, effects: [{ type: 'invincible', duration: 1 }], desc: '免疫伤害1回合' }] },
        { id: 'SSR017', name: '太阳神', element: ELEMENT_TYPE.LIGHT, rarity: 'SSR', hp: 3150, atk: 690, def: 285, spd: 81, crit: 13, icon: '☀️',
          skills: [{ id: 's1', name: '太阳审判', type: 'active', damage: 1.7, cd: 3, effects: [{ type: 'damage', value: 1.7 }], desc: '170%伤害，灼烧' }, { id: 'p1', name: '太阳光辉', type: 'passive', effects: [{ type: 'buff_atk', value: 0.12 }], desc: '全体攻击+12%' }] },
        { id: 'SSR018', name: '深海之主', element: ELEMENT_TYPE.WATER, rarity: 'SSR', hp: 3700, atk: 790, def: 325, spd: 56, crit: 11, icon: '🌊',
          skills: [{ id: 's1', name: '深海吞噬', type: 'active', damage: 1.5, cd: 4, effects: [{ type: 'damage', value: 1.5 }], desc: '全体150%伤害' }, { id: 'p1', name: '深海恢复', type: 'passive', effects: [{ type: 'hp_regen', value: 0.09 }], desc: '每回合恢复9%生命' }] },
        { id: 'SSR019', name: '炎帝', element: ELEMENT_TYPE.FIRE, rarity: 'SSR', hp: 3400, atk: 920, def: 290, spd: 78, crit: 18, icon: '🔥',
          skills: [{ id: 's1', name: '炎帝斩', type: 'active', damage: 2.1, cd: 3, effects: [{ type: 'damage', value: 2.1 }], desc: '210%伤害，灼烧' }, { id: 'p1', name: '炎帝之力', type: 'passive', effects: [{ type: 'buff_atk', value: 0.2 }], desc: '攻击+20%' }] },
        { id: 'SSR020', name: '大地之母', element: ELEMENT_TYPE.EARTH, rarity: 'SSR', hp: 4500, atk: 600, def: 450, spd: 52, crit: 7, icon: '🏔️',
          skills: [{ id: 's1', name: '大地震撼', type: 'active', damage: 1.6, cd: 4, effects: [{ type: 'damage', value: 1.6 }], desc: '全体160%伤害，眩晕' }, { id: 'p1', name: '大地守护', type: 'passive', effects: [{ type: 'buff_def', value: 0.25 }], desc: '防御+25%' }] }
`;

// 在适当位置插入新卡牌
// 1. 在SR015后插入新SR卡
content = content.replace(
    "{ id: 'SR015', name: '潮汐祭祀'",
    newSR.trim() + "\n        { id: 'SR015', name: '潮汐祭祀'"
);

// 2. 在R012后插入新R卡
content = content.replace(
    "{ id: 'R012', name: '暗影刺客'",
    newR.trim() + "\n        { id: 'R012', name: '暗影刺客'"
);

// 3. 在SSR012后插入新SSR卡
content = content.replace(
    "{ id: 'SSR012', name: '深渊吞噬者'",
    newSSR.trim() + "\n        { id: 'SSR012', name: '深渊吞噬者'"
);

// 写入文件
fs.writeFileSync('card-data.js', content);

console.log('✅ 卡牌扩展完成！');
console.log('新增：SSR x8, SR x10, R x13 = 31张');
console.log('总计：20 + 25 + 25 + 30 = 100张');
