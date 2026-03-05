// 记忆回收者 - 卡牌数据库 (简化版 for mobile demo)

const CARD_DATABASE = {
  // SSR级卡牌（传说）
  SSR: [
    { id: 'SSR001', name: '烬羽', element: 'fire', rarity: 'SSR', hp: 3500, atk: 850, def: 280, spd: 85, crit: 15, icon: '🔥' },
    { id: 'SSR002', name: '青漪', element: 'water', rarity: 'SSR', hp: 2800, atk: 920, def: 220, spd: 95, crit: 12, icon: '💧' },
    { id: 'SSR003', name: '银锋', element: 'metal', rarity: 'SSR', hp: 2600, atk: 980, def: 200, spd: 110, crit: 25, icon: '⚔️' },
    { id: 'SSR004', name: '岳尘', element: 'earth', rarity: 'SSR', hp: 4200, atk: 620, def: 420, spd: 60, crit: 8, icon: '🏔️' },
    { id: 'SSR005', name: '明烛', element: 'light', rarity: 'SSR', hp: 3000, atk: 580, def: 260, spd: 75, crit: 10, icon: '✨' },
    { id: 'SSR006', name: '幽夜', element: 'dark', rarity: 'SSR', hp: 2900, atk: 950, def: 210, spd: 90, crit: 18, icon: '🌑' }
  ],
  // SR级卡牌（史诗）
  SR: [
    { id: 'SR001', name: '炎心', element: 'fire', rarity: 'SR', hp: 2800, atk: 680, def: 220, spd: 80, crit: 12, icon: '🔥' },
    { id: 'SR002', name: '流霜', element: 'water', rarity: 'SR', hp: 2200, atk: 740, def: 180, spd: 90, crit: 10, icon: '💧' },
    { id: 'SR003', name: '铁壁', element: 'metal', rarity: 'SR', hp: 3400, atk: 500, def: 340, spd: 55, crit: 6, icon: '🛡️' },
    { id: 'SR004', name: '翠影', element: 'wood', rarity: 'SR', hp: 2100, atk: 780, def: 160, spd: 100, crit: 20, icon: '🌿' },
    { id: 'SR005', name: '磐石', element: 'earth', rarity: 'SR', hp: 3200, atk: 580, def: 320, spd: 65, crit: 8, icon: '🪨' },
    { id: 'SR006', name: '晨曦', element: 'light', rarity: 'SR', hp: 2400, atk: 460, def: 210, spd: 70, crit: 8, icon: '🌅' },
    { id: 'SR007', name: '暗影', element: 'dark', rarity: 'SR', hp: 2300, atk: 760, def: 170, spd: 95, crit: 22, icon: '🌑' }
  ],
  // R级卡牌（稀有）
  R: [
    { id: 'R001', name: '赤焰', element: 'fire', rarity: 'R', hp: 2200, atk: 540, def: 180, spd: 75, crit: 10, icon: '🔥' },
    { id: 'R002', name: '碧波', element: 'water', rarity: 'R', hp: 1800, atk: 580, def: 140, spd: 85, crit: 8, icon: '💧' },
    { id: 'R003', name: '钢刃', element: 'metal', rarity: 'R', hp: 2100, atk: 560, def: 200, spd: 70, crit: 10, icon: '⚔️' },
    { id: 'R004', name: '青藤', element: 'wood', rarity: 'R', hp: 1900, atk: 420, def: 160, spd: 80, crit: 6, icon: '🌿' },
    { id: 'R005', name: '岩盾', element: 'earth', rarity: 'R', hp: 2600, atk: 400, def: 260, spd: 50, crit: 5, icon: '🛡️' }
  ],
  // N级卡牌（普通）
  N: [
    { id: 'N001', name: '小火灵', element: 'fire', rarity: 'N', hp: 1200, atk: 380, def: 80, spd: 70, crit: 5, icon: '🔥' },
    { id: 'N002', name: '水滴', element: 'water', rarity: 'N', hp: 1000, atk: 280, def: 90, spd: 65, crit: 4, icon: '💧' },
    { id: 'N003', name: '铁块', element: 'metal', rarity: 'N', hp: 1400, atk: 320, def: 120, spd: 55, crit: 5, icon: '⚔️' },
    { id: 'N004', name: '树苗', element: 'wood', rarity: 'N', hp: 1300, atk: 300, def: 100, spd: 60, crit: 4, icon: '🌿' },
    { id: 'N005', name: '石块', element: 'earth', rarity: 'N', hp: 1600, atk: 240, def: 160, spd: 45, crit: 3, icon: '🪨' }
  ]
};

// 元素克制关系
const ELEMENT_COUNTER = {
  'fire': 'metal',
  'metal': 'wood',
  'wood': 'earth',
  'earth': 'water',
  'water': 'fire',
  'light': 'dark',
  'dark': 'light'
};

// 抽取随机卡牌
function drawCardFromDatabase() {
  const rarities = ['N', 'N', 'N', 'R', 'R', 'SR', 'SSR']; // 加权概率
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const cards = CARD_DATABASE[rarity];
  const baseCard = cards[Math.floor(Math.random() * cards.length)];
  
  // 生成1级1星实例
  return {
    ...baseCard,
    currentHp: baseCard.hp,
    maxHp: baseCard.hp,
    level: 1,
    star: 1
  };
}

// 计算伤害
function calculateDamage(attacker, defender, isCrit = false) {
  let multiplier = 1.0;
  
  // 元素克制
  if (ELEMENT_COUNTER[attacker.element] === defender.element) {
    multiplier = 1.3; // 克制 +30%
  } else if (ELEMENT_COUNTER[defender.element] === attacker.element) {
    multiplier = 0.7; // 被克 -30%
  }
  
  // 暴击
  if (isCrit) {
    multiplier *= 1.5;
  }
  
  const baseDamage = Math.max(1, attacker.atk - defender.def * 0.5);
  return Math.floor(baseDamage * multiplier);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CARD_DATABASE, drawCardFromDatabase, calculateDamage, ELEMENT_COUNTER };
}
