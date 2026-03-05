// 记忆回收者 - 卡牌数据库 v0.3 (技能系统版)

const CARD_DATABASE = {
  // SSR级卡牌（传说）
  SSR: [
    { id: 'SSR001', name: '烬羽', element: 'fire', rarity: 'SSR', hp: 3500, atk: 850, def: 280, spd: 85, crit: 15, icon: '🔥',
      skills: [
        { name: '烈焰斩', type: 'active', damage: 1.8, target: 'single', cd: 3, desc: '造成180%攻击伤害' },
        { name: '狂暴', type: 'passive', trigger: 'hp<30%', effect: 'atk+50%', desc: '生命低于30%时攻击+50%' }
      ]
    },
    { id: 'SSR002', name: '青漪', element: 'water', rarity: 'SSR', hp: 2800, atk: 920, def: 220, spd: 95, crit: 12, icon: '💧',
      skills: [
        { name: '治愈之音', type: 'active', heal: 0.3, target: 'single', cd: 3, desc: '恢复30%生命' },
        { name: '潮汐冲击', type: 'active', damage: 1.0, target: 'all', cd: 4, desc: '全体100%伤害' }
      ]
    },
    { id: 'SSR003', name: '银锋', element: 'metal', rarity: 'SSR', hp: 2600, atk: 980, def: 200, spd: 110, crit: 25, icon: '⚔️',
      skills: [
        { name: '背刺', type: 'active', damage: 1.5, target: 'single', cd: 2, desc: '150%伤害，低血暴击+30%' },
        { name: '致命一击', type: 'passive', effect: 'crit+50%', desc: '暴击伤害+50%' }
      ]
    },
    { id: 'SSR004', name: '岳尘', element: 'earth', rarity: 'SSR', hp: 4200, atk: 620, def: 420, spd: 60, crit: 8, icon: '🏔️',
      skills: [
        { name: '嘲讽', type: 'active', effect: 'taunt', target: 'all', cd: 4, desc: '强制敌人攻击自己' },
        { name: '坚韧', type: 'passive', effect: 'def+30%', desc: '防御+30%' }
      ]
    },
    { id: 'SSR005', name: '明烛', element: 'light', rarity: 'SSR', hp: 3000, atk: 580, def: 260, spd: 75, crit: 10, icon: '✨',
      skills: [
        { name: '圣光治愈', type: 'active', heal: 0.4, target: 'single', cd: 3, desc: '恢复40%生命' },
        { name: '复活', type: 'active', effect: 'revive', heal: 0.3, target: 'dead', cd: 6, desc: '复活队友30%生命' }
      ]
    },
    { id: 'SSR006', name: '幽夜', element: 'dark', rarity: 'SSR', hp: 2900, atk: 950, def: 210, spd: 90, crit: 18, icon: '🌑',
      skills: [
        { name: '暗影 burst', type: 'active', damage: 2.0, target: 'single', cd: 3, desc: '200%伤害' },
        { name: '生命汲取', type: 'passive', effect: 'lifesteal', value: 0.15, desc: '伤害15%转化为生命' }
      ]
    }
  ],
  // SR级卡牌（史诗）
  SR: [
    { id: 'SR001', name: '炎心', element: 'fire', rarity: 'SR', hp: 2800, atk: 680, def: 220, spd: 80, crit: 12, icon: '🔥',
      skills: [
        { name: '火焰冲击', type: 'active', damage: 1.5, target: 'single', cd: 3, desc: '150%火属性伤害' },
        { name: '燃烧意志', type: 'passive', effect: 'atk+20%', desc: '攻击+20%' }
      ]
    },
    { id: 'SR002', name: '流霜', element: 'water', rarity: 'SR', hp: 2200, atk: 740, def: 180, spd: 90, crit: 10, icon: '💧',
      skills: [
        { name: '冰霜箭', type: 'active', damage: 1.4, target: 'single', cd: 3, desc: '140%伤害，20%冰冻' },
        { name: '寒冰护甲', type: 'passive', effect: 'def+25%', desc: '防御+25%' }
      ]
    },
    { id: 'SR003', name: '铁壁', element: 'metal', rarity: 'SR', hp: 3400, atk: 500, def: 340, spd: 55, crit: 6, icon: '🛡️',
      skills: [
        { name: '盾击', type: 'active', damage: 1.2, target: 'single', cd: 3, desc: '120%伤害，获得护盾' },
        { name: '钢铁意志', type: 'passive', effect: 'hp+20%', desc: '生命+20%' }
      ]
    },
    { id: 'SR004', name: '翠影', element: 'wood', rarity: 'SR', hp: 2100, atk: 780, def: 160, spd: 100, crit: 20, icon: '🌿',
      skills: [
        { name: '连环击', type: 'active', damage: 1.3, target: 'single', cd: 2, desc: '130%伤害，连击2次' },
        { name: '自然祝福', type: 'passive', effect: 'spd+15%', desc: '速度+15%' }
      ]
    },
    { id: 'SR005', name: '磐石', element: 'earth', rarity: 'SR', hp: 3200, atk: 580, def: 320, spd: 65, crit: 8, icon: '🪨',
      skills: [
        { name: '地震', type: 'active', damage: 1.1, target: 'all', cd: 4, desc: '全体110%伤害' },
        { name: '岩石皮肤', type: 'passive', effect: 'def+20%', desc: '防御+20%' }
      ]
    },
    { id: 'SR006', name: '晨曦', element: 'light', rarity: 'SR', hp: 2400, atk: 460, def: 210, spd: 70, crit: 8, icon: '🌅',
      skills: [
        { name: '圣光治疗', type: 'active', heal: 0.25, target: 'single', cd: 3, desc: '恢复25%生命' },
        { name: '光明庇护', type: 'passive', effect: 'def+15%', desc: '防御+15%' }
      ]
    },
    { id: 'SR007', name: '暗影', element: 'dark', rarity: 'SR', hp: 2300, atk: 760, def: 170, spd: 95, crit: 22, icon: '🌑',
      skills: [
        { name: '暗影突袭', type: 'active', damage: 1.6, target: 'single', cd: 3, desc: '160%伤害' },
        { name: '隐匿', type: 'passive', effect: 'crit+15%', desc: '暴击率+15%' }
      ]
    }
  ],
  // R级卡牌（稀有）
  R: [
    { id: 'R001', name: '赤焰', element: 'fire', rarity: 'R', hp: 2200, atk: 540, def: 180, spd: 75, crit: 10, icon: '🔥',
      skills: [
        { name: '火球术', type: 'active', damage: 1.3, target: 'single', cd: 3, desc: '130%火伤害' }
      ]
    },
    { id: 'R002', name: '碧波', element: 'water', rarity: 'R', hp: 1800, atk: 580, def: 140, spd: 85, crit: 8, icon: '💧',
      skills: [
        { name: '治疗术', type: 'active', heal: 0.2, target: 'single', cd: 3, desc: '恢复20%生命' }
      ]
    },
    { id: 'R003', name: '钢刃', element: 'metal', rarity: 'R', hp: 2100, atk: 560, def: 200, spd: 70, crit: 10, icon: '⚔️',
      skills: [
        { name: '斩击', type: 'active', damage: 1.4, target: 'single', cd: 3, desc: '140%伤害' }
      ]
    },
    { id: 'R004', name: '青藤', element: 'wood', rarity: 'R', hp: 1900, atk: 420, def: 160, spd: 80, crit: 6, icon: '🌿',
      skills: [
        { name: '缠绕', type: 'active', damage: 1.2, target: 'single', cd: 3, desc: '120%伤害，减速' }
      ]
    },
    { id: 'R005', name: '岩盾', element: 'earth', rarity: 'R', hp: 2600, atk: 400, def: 260, spd: 50, crit: 5, icon: '🛡️',
      skills: [
        { name: '守护', type: 'active', effect: 'shield', target: 'self', cd: 4, desc: '获得护盾' }
      ]
    }
  ],
  // N级卡牌（普通）
  N: [
    { id: 'N001', name: '小火灵', element: 'fire', rarity: 'N', hp: 1200, atk: 380, def: 80, spd: 70, crit: 5, icon: '🔥', skills: [] },
    { id: 'N002', name: '水滴', element: 'water', rarity: 'N', hp: 1000, atk: 280, def: 90, spd: 65, crit: 4, icon: '💧', skills: [] },
    { id: 'N003', name: '铁块', element: 'metal', rarity: 'N', hp: 1400, atk: 320, def: 120, spd: 55, crit: 5, icon: '⚔️', skills: [] },
    { id: 'N004', name: '树苗', element: 'wood', rarity: 'N', hp: 1300, atk: 300, def: 100, spd: 60, crit: 4, icon: '🌿', skills: [] },
    { id: 'N005', name: '石块', element: 'earth', rarity: 'N', hp: 1600, atk: 240, def: 160, spd: 45, crit: 3, icon: '🪨', skills: [] }
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
  
  // 生成1级1星实例，初始化技能CD
  return {
    ...baseCard,
    currentHp: baseCard.hp,
    maxHp: baseCard.hp,
    level: 1,
    star: 1,
    skillCooldowns: (baseCard.skills || []).map(() => 0) // 初始化技能冷却
  };
}

// 计算伤害
function calculateDamage(attacker, defender, isCrit = false, skillMultiplier = 1.0) {
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
  
  // 技能倍率
  multiplier *= skillMultiplier;
  
  const baseDamage = Math.max(1, attacker.atk - defender.def * 0.5);
  return Math.floor(baseDamage * multiplier);
}

// 计算治疗
function calculateHeal(healer, target, healPercent) {
  return Math.floor(target.maxHp * healPercent);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CARD_DATABASE, drawCardFromDatabase, calculateDamage, calculateHeal, ELEMENT_COUNTER };
}
