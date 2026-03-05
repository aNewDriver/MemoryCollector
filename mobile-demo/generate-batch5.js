// 批量生成卡牌批次5 - 达到500张 (最后100张)
const fs = require('fs');

let content = fs.readFileSync('card-data.js', 'utf8');

function generateFinalBatch() {
    const cards = { N: [], R: [], SR: [], SSR: [] };
    const roles = ['warrior', 'mage', 'assassin', 'tank', 'healer', 'support'];
    const elements = ['fire', 'water', 'wood', 'metal', 'earth', 'light', 'dark'];
    
    const prefixes = {
        fire: ['烈焰', '熔岩', '爆炎', '赤焰', '焚天', '火舞', '炎龙', '红莲', '炽焰', '熔火', '烈火', '燃烧', '凤凰', '熔炉', '余烬'],
        water: ['潮汐', '海流', '冰霜', '流水', '海浪', '深海', '冰川', '漩涡', '暴雨', '寒流', '海啸', '波涛', '涌泉', '暗流', '碧水'],
        wood: ['森林', '藤蔓', '古树', '自然', '荆棘', '绿叶', '疾风', '苍翠', '藤蔓', '青木', '竹林', '花丛', '树根', '苔藓', '蕨类'],
        metal: ['钢铁', '利刃', '银锋', '铁壁', '锋芒', '金刚', '雷霆', '白金', '玄铁', '钨钢', '铜墙', '铁壁', '合金', '钛金', '陨铁'],
        earth: ['岩石', '大地', '山岭', '巨石', '岩层', '沙漠', '峡谷', '黄土', '砂岩', '峰峦', '丘陵', '高原', '洞穴', '矿脉', '板块'],
        light: ['圣光', '光明', '闪耀', '光辉', '太阳', '星辰', '晨曦', '天光', '圣辉', '璀璨', '耀斑', '光芒', '极光', '晨曦', '曙光'],
        dark: ['暗影', '黑暗', '夜幕', '深渊', '虚空', '幽冥', '鬼魅', '魔影', '黑雾', '冥界', '黯影', '幽暗', '混沌', '虚无', '湮灭']
    };
    
    const suffixes = { warrior: '战士', mage: '法师', assassin: '刺客', tank: '守卫', healer: '治疗师', support: '辅助' };
    
    const icons = {
        fire: ['🔥', '🔆', '☀️', '🌋', '💥', '⚡', '🔥', '🌅', '💥', '🔥', '🔥', '🔥', '🐦', '🏭', '🔥'],
        water: ['💧', '❄️', '🌊', '☔', '💦', '🐟', '🌊', '🌀', '⛈️', '❄️', '🌊', '🌊', '⛲', '🌊', '💧'],
        wood: ['🌿', '🌲', '🍃', '🌱', '🌳', '🎋', '🍃', '🌴', '🌾', '🌵', '🌿', '🌿', '🌳', '🌿', '🌿'],
        metal: ['⚔️', '🛡️', '🔨', '⚙️', '🔱', '🗡️', '⚔️', '🔧', '⛓️', '🛡️', '⚔️', '🛡️', '🔩', '🔨', '☄️'],
        earth: ['🏔️', '🪨', '⛰️', '🗿', '🏺', '🏛️', '🪨', '🏜️', '🏝️', '🏔️', '🏔️', '🏔️', '🕳️', '⛏️', '🌍'],
        light: ['✨', '⭐', '☀️', '🌟', '💫', '🔆', '⭐', '🌞', '💡', '✨', '✨', '✨', '🌌', '🌅', '🌄'],
        dark: ['🌑', '🌙', '🌌', '👻', '🎭', '🌚', '🌙', '🔮', '💀', '🌑', '🌑', '🌑', '🌪️', '🕳️', '💥']
    };
    
    // 最后100张：N:50, R:30, SR:15, SSR:5
    const counts = { N: 50, R: 30, SR: 15, SSR: 5 };
    const startNums = { N: 171, R: 126, SR: 73, SSR: 36 };
    
    Object.entries(counts).forEach(([rarity, count]) => {
        const mult = { N: 1.0, R: 1.3, SR: 1.6, SSR: 2.0 }[rarity];
        
        for (let i = 0; i < count; i++) {
            const element = elements[i % 7];
            const role = roles[i % 6];
            const id = rarity + String(startNums[rarity] + i).padStart(3, '0');
            const prefix = prefixes[element][Math.floor(i / 7) % 15];
            const suffix = suffixes[role];
            const name = prefix + suffix;
            const icon = icons[element][i % 15];
            
            const base = { warrior: { hp: 3000, atk: 700, def: 250, spd: 70, crit: 10 }, mage: { hp: 2200, atk: 850, def: 180, spd: 85, crit: 12 }, assassin: { hp: 2400, atk: 900, def: 150, spd: 110, crit: 25 }, tank: { hp: 4000, atk: 550, def: 400, spd: 50, crit: 5 }, healer: { hp: 2600, atk: 500, def: 220, spd: 75, crit: 8 }, support: { hp: 2800, atk: 600, def: 250, spd: 80, crit: 10 } }[role];
            
            const hp = Math.floor(base.hp * mult);
            const atk = Math.floor(base.atk * mult);
            const def = Math.floor(base.def * mult);
            const spd = Math.floor(base.spd * (rarity === 'SSR' ? 1.1 : 1));
            const crit = Math.min(50, base.crit + (mult - 1) * 10);
            
            let skill = '';
            if (rarity !== 'N') {
                const dmg = rarity === 'SSR' ? 1.8 : rarity === 'SR' ? 1.5 : 1.35;
                skill = `skills: [{ id: 's1', name: '攻击', type: 'active', damage: ${dmg}, cd: 3, effects: [{ type: 'damage', value: ${dmg} }], desc: '${Math.floor(dmg * 100)}%伤害' }]`;
            } else {
                skill = 'skills: []';
            }
            
            cards[rarity].push(`        { id: '${id}', name: '${name}', element: ELEMENT_TYPE.${element.toUpperCase()}, rarity: '${rarity}', hp: ${hp}, atk: ${atk}, def: ${def}, spd: ${spd}, crit: ${crit}, icon: '${icon}', ${skill} },`);
        }
    });
    
    return cards;
}

const batch5 = generateFinalBatch();

// 插入到文件
const lastIds = { N: 'N170', R: 'R125', SR: 'SR072', SSR: 'SSR035' };
Object.entries(batch5).forEach(([rarity, cardList]) => {
    const regex = new RegExp(`{ id: '${lastIds[rarity]}[^}]+}`);
    content = content.replace(regex, match => match + '\n' + cardList.join('\n'));
});

fs.writeFileSync('card-data.js', content);

console.log('🎉🎉🎉 卡牌批次5生成完成！');
console.log('新增：N卡50张 + R卡30张 + SR卡15张 + SSR卡5张 = 100张');
console.log('总计：400 + 100 = 500张');
console.log('✅ 达成500张卡牌目标！');
