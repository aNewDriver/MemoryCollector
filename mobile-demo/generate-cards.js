// 批量生成卡牌脚本
const fs = require('fs');

// 配置
const TARGET_TOTAL = 100;
const CURRENT_COUNT = 51;
const GENERATE_COUNT = TARGET_TOTAL - CURRENT_COUNT;

const elements = ['fire', 'water', 'wood', 'metal', 'earth', 'light', 'dark'];
const roles = ['warrior', 'mage', 'assassin', 'tank', 'healer', 'support'];

const ELEMENT_MAP = {
  fire: 'FIRE',
  water: 'WATER', 
  wood: 'WOOD',
  metal: 'METAL',
  earth: 'EARTH',
  light: 'LIGHT',
  dark: 'DARK'
};

const ICONS = {
  fire: ['🔥', '🔆', '☀️', '🌋', '💥'],
  water: ['💧', '❄️', '🌊', '☔', '💦'],
  wood: ['🌿', '🌲', '🍃', '🌱', '🌳'],
  metal: ['⚔️', '🛡️', '🔨', '⚙️', '🔱'],
  earth: ['🏔️', '🪨', '⛰️', '🗿', '🏺'],
  light: ['✨', '⭐', '☀️', '🌟', '💫'],
  dark: ['🌑', '🌙', '🌌', '👻', '🎭']
};

const NAMES = {
  fire: { warrior: '烈焰战士', mage: '烈焰法师', assassin: '火影刺客', tank: '熔岩守卫', healer: '温暖治疗师', support: '火焰辅助' },
  water: { warrior: '潮汐战士', mage: '海啸法师', assassin: '流水刺客', tank: '深海守卫', healer: '治愈治疗师', support: '水流辅助' },
  wood: { warrior: '森林战士', mage: '自然法师', assassin: '叶影刺客', tank: '古树守卫', healer: '森林治疗师', support: '自然辅助' },
  metal: { warrior: '钢铁战士', mage: '炼金法师', assassin: '银刃刺客', tank: '钢铁守卫', healer: '金属治疗师', support: '金属辅助' },
  earth: { warrior: '岩石战士', mage: '大地法师', assassin: '岩石刺客', tank: '岩石守卫', healer: '大地治疗师', support: '大地辅助' },
  light: { warrior: '圣光战士', mage: '光明法师', assassin: '光刃刺客', tank: '圣光守卫', healer: '光明治疗师', support: '光明辅助' },
  dark: { warrior: '暗影战士', mage: '暗影法师', assassin: '暗夜刺客', tank: '暗影守卫', healer: '暗影治疗师', support: '暗影辅助' }
};

function generateCard(rarity, element, role, index) {
  const multipliers = { N: 1.0, R: 1.3, SR: 1.6, SSR: 2.0 };
  const mult = multipliers[rarity];
  
  const baseStats = {
    warrior: { hp: 3000, atk: 700, def: 250, spd: 70, crit: 10 },
    mage: { hp: 2200, atk: 850, def: 180, spd: 85, crit: 12 },
    assassin: { hp: 2400, atk: 900, def: 150, spd: 110, crit: 25 },
    tank: { hp: 4000, atk: 550, def: 400, spd: 50, crit: 5 },
    healer: { hp: 2600, atk: 500, def: 220, spd: 75, crit: 8 },
    support: { hp: 2800, atk: 600, def: 250, spd: 80, crit: 10 }
  };
  
  const base = baseStats[role];
  const id = rarity + String(index).padStart(3, '0');
  const name = NAMES[element][role] + ' ' + String(Math.floor(index/7) + 1);
  const icon = ICONS[element][index % 5];
  
  const hp = Math.floor(base.hp * mult);
  const atk = Math.floor(base.atk * mult);
  const def = Math.floor(base.def * mult);
  const spd = Math.floor(base.spd * (rarity === 'SSR' ? 1.1 : 1));
  const crit = Math.min(50, base.crit + (mult - 1) * 10);
  
  let skillDesc = '';
  if (rarity !== 'N') {
    if (role === 'healer') {
      skillDesc = `skills: [{ id: 's1', name: '治疗', type: 'active', heal: 0.25, cd: 3, effects: [{ type: 'heal', value: 0.25 }], desc: '恢复25%生命' }]`;
    } else if (role === 'tank') {
      skillDesc = `skills: [{ id: 's1', name: '护盾', type: 'active', effect: 'shield', cd: 4, effects: [{ type: 'shield', value: 300 }], desc: '获得300护盾' }]`;
    } else {
      skillDesc = `skills: [{ id: 's1', name: '重击', type: 'active', damage: 1.5, cd: 3, effects: [{ type: 'damage', value: 1.5 }], desc: '150%伤害' }]`;
    }
  } else {
    skillDesc = 'skills: []';
  }
  
  return `        { id: '${id}', name: '${name}', element: ELEMENT_TYPE.${ELEMENT_MAP[element]}, rarity: '${rarity}', hp: ${hp}, atk: ${atk}, def: ${def}, spd: ${spd}, crit: ${crit}, icon: '${icon}', ${skillDesc} },`;
}

// 生成卡牌
let output = '\n// ==================== 批量生成卡牌 (52-100张) ====================\n';

// N卡 13-30 (18张)
output += '\n    // N级卡牌扩展\n';
for (let i = 0; i < 18; i++) {
  const element = elements[i % 7];
  const role = roles[i % 6];
  output += generateCard('N', element, role, 13 + i) + '\n';
}

// R卡 13-25 (13张)
output += '\n    // R级卡牌扩展\n';
for (let i = 0; i < 13; i++) {
  const element = elements[i % 7];
  const role = roles[i % 6];
  output += generateCard('R', element, role, 13 + i) + '\n';
}

// SR卡 16-25 (10张)
output += '\n    // SR级卡牌扩展\n';
for (let i = 0; i < 10; i++) {
  const element = elements[i % 7];
  const role = roles[i % 6];
  output += generateCard('SR', element, role, 16 + i) + '\n';
}

// SSR卡 13-20 (8张)
output += '\n    // SSR级卡牌扩展\n';
for (let i = 0; i < 8; i++) {
  const element = elements[i % 7];
  const role = roles[i % 6];
  output += generateCard('SSR', element, role, 13 + i) + '\n';
}

console.log('=== 生成的卡牌代码 ===');
console.log(output);
console.log('\n=== 统计 ===');
console.log('N卡: 18张 (13-30)');
console.log('R卡: 13张 (13-25)');
console.log('SR卡: 10张 (16-25)');
console.log('SSR卡: 8张 (13-20)');
console.log('总计:', 18 + 13 + 10 + 8, '张');
console.log('目标: 100张');
