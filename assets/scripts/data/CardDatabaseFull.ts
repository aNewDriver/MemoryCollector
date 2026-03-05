/**
 * 记忆回收者 - 完整卡牌数据库
 * 根据数值策划表生成
 */

import { CardData, Rarity, Element, ClassType, Skill } from '../CardData';

// SSR级卡牌（传说）
export const SSR_CARDS: CardData[] = [
  {
    id: 'SSR001',
    name: '烬羽',
    title: '炎之剑士',
    element: Element.FIRE,
    classType: ClassType.WARRIOR,
    rarity: Rarity.SSR,
    baseStats: { hp: 3500, atk: 850, def: 280, spd: 85, crit: 0.15 },
    description: '火焰中的孤独剑客，以燃烧生命为代价挥出毁灭之刃。',
    skills: [
      { id: 'SKILL001', name: '烈焰斩', type: 'active', effect: 'damage', value: 1.8, target: 'single', cooldown: 3 },
      { id: 'PASS001', name: '狂暴', type: 'passive', effect: 'buff', trigger: 'hp<30', value: 0.5 }
    ]
  },
  {
    id: 'SSR002',
    name: '青漪',
    title: '流水琴师',
    element: Element.WATER,
    classType: ClassType.MAGE,
    rarity: Rarity.SSR,
    baseStats: { hp: 2800, atk: 920, def: 220, spd: 95, crit: 0.12 },
    description: '弹奏流水之音的琴师，以音律治愈万物。',
    skills: [
      { id: 'SKILL003', name: '治愈之音', type: 'active', effect: 'heal', value: 0.3, target: 'single', cooldown: 3 },
      { id: 'SKILL002', name: '潮汐冲击', type: 'active', effect: 'damage', value: 1.0, target: 'all', cooldown: 4 }
    ]
  },
  {
    id: 'SSR003',
    name: '银锋',
    title: '影之刺客',
    element: Element.METAL,
    classType: ClassType.ASSASSIN,
    rarity: Rarity.SSR,
    baseStats: { hp: 2600, atk: 980, def: 200, spd: 110, crit: 0.25 },
    description: '行走在阴影中的刺客，银色双刃收割生命。',
    skills: [
      { id: 'SKILL005', name: '背刺', type: 'active', effect: 'damage', value: 1.5, target: 'single', cooldown: 2 },
      { id: 'PASS004', name: '致命一击', type: 'passive', effect: 'crit', value: 0.5 }
    ]
  },
  {
    id: 'SSR004',
    name: '岳尘',
    title: '大地守护者',
    element: Element.EARTH,
    classType: ClassType.TANK,
    rarity: Rarity.SSR,
    baseStats: { hp: 4200, atk: 620, def: 420, spd: 60, crit: 0.08 },
    description: '如山岳般沉稳的守护者，以身为盾守护同伴。',
    skills: [
      { id: 'SKILL006', name: '嘲讽', type: 'active', effect: 'taunt', value: 1, target: 'all', cooldown: 4 },
      { id: 'PASS002', name: '坚韧', type: 'passive', effect: 'def', value: 0.3 }
    ]
  },
  {
    id: 'SSR005',
    name: '明烛',
    title: '圣光祭司',
    element: Element.LIGHT,
    classType: ClassType.HEALER,
    rarity: Rarity.SSR,
    baseStats: { hp: 3000, atk: 580, def: 260, spd: 75, crit: 0.10 },
    description: '手持圣光之烛的祭司，驱散黑暗带来希望。',
    skills: [
      { id: 'SKILL003', name: '圣光治愈', type: 'active', effect: 'heal', value: 0.4, target: 'single', cooldown: 3 },
      { id: 'SKILL007', name: '复活', type: 'active', effect: 'revive', value: 0.3, target: 'dead', cooldown: 6 }
    ]
  },
  {
    id: 'SSR006',
    name: '幽夜',
    title: '暗影法师',
    element: Element.DARK,
    classType: ClassType.MAGE,
    rarity: Rarity.SSR,
    baseStats: { hp: 2900, atk: 950, def: 210, spd: 90, crit: 0.18 },
    description: '操纵暗影之力的神秘法师，敌人在黑暗中颤栗。',
    skills: [
      { id: 'SKILL009', name: '暗影 burst', type: 'active', effect: 'damage', value: 2.0, target: 'single', cooldown: 3 },
      { id: 'PASS003', name: '生命汲取', type: 'passive', effect: 'lifesteal', value: 0.15 }
    ]
  }
];

// SR级卡牌（史诗）
export const SR_CARDS: CardData[] = [
  {
    id: 'SR001',
    name: '炎心',
    element: Element.FIRE,
    classType: ClassType.WARRIOR,
    rarity: Rarity.SR,
    baseStats: { hp: 2800, atk: 680, def: 220, spd: 80, crit: 0.12 },
    description: '热血的战士，心中燃烧着不灭的战意。',
    skills: []
  },
  {
    id: 'SR002',
    name: '流霜',
    element: Element.WATER,
    classType: ClassType.MAGE,
    rarity: Rarity.SR,
    baseStats: { hp: 2200, atk: 740, def: 180, spd: 90, crit: 0.10 },
    description: '操控冰霜的法师，敌人将在寒冷中冻结。',
    skills: []
  },
  {
    id: 'SR003',
    name: '铁壁',
    element: Element.METAL,
    classType: ClassType.TANK,
    rarity: Rarity.SR,
    baseStats: { hp: 3400, atk: 500, def: 340, spd: 55, crit: 0.06 },
    description: '身披重甲的铁壁，任何攻击都无法撼动。',
    skills: []
  },
  {
    id: 'SR004',
    name: '翠影',
    element: Element.WOOD,
    classType: ClassType.ASSASSIN,
    rarity: Rarity.SR,
    baseStats: { hp: 2100, atk: 780, def: 160, spd: 100, crit: 0.20 },
    description: '穿梭于林间的猎手，如风般迅捷。',
    skills: []
  },
  {
    id: 'SR005',
    name: '磐石',
    element: Element.EARTH,
    classType: ClassType.WARRIOR,
    rarity: Rarity.SR,
    baseStats: { hp: 3200, atk: 580, def: 320, spd: 65, crit: 0.08 },
    description: '如山石般坚毅，以力量粉碎一切阻碍。',
    skills: []
  },
  {
    id: 'SR006',
    name: '晨曦',
    element: Element.LIGHT,
    classType: ClassType.HEALER,
    rarity: Rarity.SR,
    baseStats: { hp: 2400, atk: 460, def: 210, spd: 70, crit: 0.08 },
    description: '带来晨曦光芒的治疗者，温暖而可靠。',
    skills: []
  },
  {
    id: 'SR007',
    name: '暗影',
    element: Element.DARK,
    classType: ClassType.ASSASSIN,
    rarity: Rarity.SR,
    baseStats: { hp: 2300, atk: 760, def: 170, spd: 95, crit: 0.22 },
    description: '潜行于黑暗中的暗杀者，死亡如影随形。',
    skills: []
  }
];

// R级卡牌（稀有）
export const R_CARDS: CardData[] = [
  { id: 'R001', name: '赤焰', element: Element.FIRE, classType: ClassType.WARRIOR, rarity: Rarity.R, baseStats: { hp: 2200, atk: 540, def: 180, spd: 75, crit: 0.10 }, description: '年轻的火焰战士，正在磨练自己的技艺。' },
  { id: 'R002', name: '碧波', element: Element.WATER, classType: ClassType.MAGE, rarity: Rarity.R, baseStats: { hp: 1800, atk: 580, def: 140, spd: 85, crit: 0.08 }, description: '操控水流的学徒法师，潜力巨大。' },
  { id: 'R003', name: '钢刃', element: Element.METAL, classType: ClassType.WARRIOR, rarity: Rarity.R, baseStats: { hp: 2100, atk: 560, def: 200, spd: 70, crit: 0.10 }, description: '挥舞钢刃的战士，剑术精湛。' },
  { id: 'R004', name: '青藤', element: Element.WOOD, classType: ClassType.HEALER, rarity: Rarity.R, baseStats: { hp: 1900, atk: 420, def: 160, spd: 80, crit: 0.06 }, description: '与自然亲近的治疗者，温柔而坚韧。' },
  { id: 'R005', name: '岩盾', element: Element.EARTH, classType: ClassType.TANK, rarity: Rarity.R, baseStats: { hp: 2600, atk: 400, def: 260, spd: 50, crit: 0.05 }, description: '手持岩盾的守卫，坚不可摧。' }
];

// N级卡牌（普通）
export const N_CARDS: CardData[] = [
  { id: 'N001', name: '小火灵', element: Element.FIRE, classType: ClassType.MAGE, rarity: Rarity.N, baseStats: { hp: 1200, atk: 380, def: 80, spd: 70, crit: 0.05 }, description: '微弱的火焰精灵，渴望变得更强。' },
  { id: 'N002', name: '水滴', element: Element.WATER, classType: ClassType.HEALER, rarity: Rarity.N, baseStats: { hp: 1000, atk: 280, def: 90, spd: 65, crit: 0.04 }, description: '纯净的水滴，拥有治愈之力。' },
  { id: 'N003', name: '铁块', element: Element.METAL, classType: ClassType.WARRIOR, rarity: Rarity.N, baseStats: { hp: 1400, atk: 320, def: 120, spd: 55, crit: 0.05 }, description: '坚硬的铁块，虽然笨拙但力量十足。' },
  { id: 'N004', name: '树苗', element: Element.WOOD, classType: ClassType.WARRIOR, rarity: Rarity.N, baseStats: { hp: 1300, atk: 300, def: 100, spd: 60, crit: 0.04 }, description: '刚发芽的树苗，充满希望。' },
  { id: 'N005', name: '石块', element: Element.EARTH, classType: ClassType.TANK, rarity: Rarity.N, baseStats: { hp: 1600, atk: 240, def: 160, spd: 45, crit: 0.03 }, description: '普通的石块，但足够坚硬。' }
];

// 所有卡牌合集
export const ALL_CARDS: CardData[] = [
  ...SSR_CARDS,
  ...SR_CARDS,
  ...R_CARDS,
  ...N_CARDS
];

// 按稀有度获取卡牌
export function getCardsByRarity(rarity: Rarity): CardData[] {
  return ALL_CARDS.filter(card => card.rarity === rarity);
}

// 按元素获取卡牌
export function getCardsByElement(element: Element): CardData[] {
  return ALL_CARDS.filter(card => card.element === element);
}

// 获取指定ID卡牌
export function getCardById(id: string): CardData | undefined {
  return ALL_CARDS.find(card => card.id === id);
}

// 生成完整卡牌（带等级和星级）
export function generateCardInstance(
  cardId: string,
  level: number = 1,
  star: number = 1
): CardData | null {
  const baseCard = getCardById(cardId);
  if (!baseCard) return null;

  // 应用等级成长
  const levelMultiplier = 1 + (level - 1) * 0.03;
  // 应用星级成长
  const starMultiplier = 1 + (star - 1) * 0.2;

  return {
    ...baseCard,
    currentLevel: level,
    currentStar: star,
    currentStats: {
      hp: Math.floor(baseCard.baseStats.hp * levelMultiplier * starMultiplier),
      atk: Math.floor(baseCard.baseStats.atk * levelMultiplier * starMultiplier),
      def: Math.floor(baseCard.baseStats.def * levelMultiplier * starMultiplier),
      spd: Math.floor(baseCard.baseStats.spd * (1 + (level - 1) * 0.02) * (1 + (star - 1) * 0.1)),
      crit: Math.min(1, baseCard.baseStats.crit + (star - 1) * 0.02)
    }
  };
}

export default ALL_CARDS;
