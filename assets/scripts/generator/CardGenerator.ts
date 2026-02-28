/**
 * 卡牌批量生成器
 * 生成700张卡牌（每元素100张）
 * 品质分布：绿40%、蓝30%、紫20%、金15%、红5%、彩5张
 */

import { CardData, ElementType, Rarity } from '../data/CardData';
import { CardArchetype } from '../archetype/ArchetypeSystem';

// 生成配置
const GENERATION_CONFIG = {
    cardsPerElement: 100,
    totalElements: 7,  // 金木水火土 + 光暗
    rarityDistribution: {
        [Rarity.GREEN]: 0.40,   // 40%
        [Rarity.BLUE]: 0.30,    // 30%
        [Rarity.PURPLE]: 0.15,  // 15%
        [Rarity.GOLD]: 0.08,    // 8%
        [Rarity.RED]: 0.05,     // 5%
        [Rarity.RAINBOW]: 0.02  // 2% (实际只有5张)
    },
    // 光暗元素最小稀有度为红色
    lightDarkMinRarity: Rarity.RED
};

// 名字库
const NAME_COMPONENTS = {
    prefixes: {
        metal: ['铁', '钢', '银', '铜', '金', '玄铁', '精钢', '陨铁', '秘银', '青铜'],
        wood: ['青', '翠', '苍', '松', '竹', '梅', '柳', '藤', '叶', '木'],
        water: ['玄', '冰', '霜', '寒', '雪', '浪', '涛', '泉', '溪', '流'],
        fire: ['烈', '炎', '焰', '炽', '焚', '烬', '燃', '灼', '红', '赤'],
        earth: ['岩', '石', '山', '岳', '峰', '岭', '丘', '壤', '尘', '沙'],
        light: ['圣', '光', '明', '辉', '耀', '曦', '曜', '煌', '灿', '皓'],
        dark: ['暗', '影', '冥', '幽', '渊', '幽', '黑', '墨', '玄', '黯']
    },
    
    names: {
        metal: ['锋', '刃', '剑', '刀', '枪', '戟', '锤', '斧', '弓', '矢', '甲', '铠', '盾', '卫', '将', '兵', '卒', '士', '侠', '客'],
        wood: ['灵', '仙', '妖', '精', '怪', '魅', '妖', '姬', '郎', '女', '生', '者', '师', '使', '卫', '护', '守', '佑', '庇', '荫'],
        water: ['龙', '蛟', '鲨', '鲸', '鲲', '鹏', '凤', '凰', '鸾', '鹤', '仙', '神', '灵', '妖', '精', '怪', '魔', '鬼', '魂', '魄'],
        fire: ['凤', '凰', '鸾', '雀', '鸦', '乌', '炎', '焱', '燚', '烬', '灰', '烟', '雾', '霞', '云', '虹', '霓', '光', '焰', '芒'],
        earth: ['熊', '虎', '狮', '豹', '狼', '犬', '牛', '马', '象', '犀', '龟', '蛇', '蟒', '蜥', '鳄', '龟', '鳌', '鼋', '蜃', '螭'],
        light: ['使', '徒', '者', '卫', '护', '佑', '庇', '主', '宰', '帝', '皇', '王', '尊', '圣', '贤', '哲', '师', '导', '引', '路'],
        dark: ['魔', '鬼', '妖', '怪', '精', '灵', '魂', '魄', '影', '魅', '魍', '魉', '魑', '魅', '妖', '邪', '恶', '煞', '凶', '厉']
    },
    
    titles: {
        metal: ['剑圣', '刀客', '枪王', '盾卫', '铁壁', '利刃', '锋芒', '无敌', '战神', '勇士'],
        wood: ['灵使', '森守', '妖姬', '树精', '花仙', '草医', '藤护', '叶刃', '木师', '林主'],
        water: ['龙王', '海神', '冰皇', '雪姬', '浪客', '涛声', '泉眼', '溪流', '波澜', '深渊'],
        fire: ['炎帝', '火神', '焰姬', '焚天', '灼日', '灰烬', '红莲', '赤羽', '金乌', '骄阳'],
        earth: ['山岳', '岩王', '土皇', '地母', '石心', '峰主', '岭守', '丘护', '壤师', '尘客'],
        light: ['圣者', '光使', '明主', '辉耀', '曦晨', '皓月', '煌帝', '灿星', '天使', '神使'],
        dark: ['魔王', '暗影', '冥主', '幽皇', '渊帝', '黑帝', '墨王', '玄主', '黯夜', '死神']
    }
};

// 技能模板库
const SKILL_TEMPLATES: Record<CardArchetype, {
    normal: { name: string; desc: string }[];
    special: { name: string; desc: string; cost: number }[];
    passive: { name: string; desc: string }[];
}> = {
    [CardArchetype.CRIT]: {
        normal: [
            { name: '暴击打击', desc: '造成攻击100%伤害，暴击率+10%' },
            { name: '致命一击', desc: '造成攻击90%伤害，暴击率+20%' }
        ],
        special: [
            { name: '无双斩', desc: '造成攻击200%伤害，必定暴击', cost: 30 },
            { name: '狂暴击', desc: '造成攻击150%伤害，暴击伤害+50%', cost: 25 }
        ],
        passive: [
            { name: '暴击之心', desc: '暴击率+15%，暴击伤害+30%' },
            { name: '致命本能', desc: '生命低于30%时，暴击率+50%' }
        ]
    },
    [CardArchetype.COMBO]: {
        normal: [
            { name: '连击', desc: '造成2次攻击60%伤害' },
            { name: '疾风', desc: '造成3次攻击40%伤害' }
        ],
        special: [
            { name: '狂风暴雨', desc: '造成5次攻击50%伤害', cost: 35 },
            { name: '无尽连击', desc: '造成攻击100%伤害，50%概率再次行动', cost: 30 }
        ],
        passive: [
            { name: '连击大师', desc: '普攻有30%概率触发额外1次攻击' },
            { name: '迅捷', desc: '速度+20%，连击伤害+20%' }
        ]
    },
    [CardArchetype.POISON]: {
        normal: [
            { name: '毒刃', desc: '造成攻击80%伤害，附加1层毒' },
            { name: '腐蚀', desc: '造成攻击70%伤害，附加2层毒' }
        ],
        special: [
            { name: '剧毒爆发', desc: '立即触发目标所有毒素伤害', cost: 30 },
            { name: '瘟疫', desc: '对全体附加3层毒', cost: 40 }
        ],
        passive: [
            { name: '毒素强化', desc: '毒素伤害+30%，可叠加层数+1' },
            { name: '毒体', desc: '攻击附带毒素的目标时，恢复造成伤害20%生命' }
        ]
    },
    [CardArchetype.BURN]: {
        normal: [
            { name: '火球', desc: '造成攻击90%伤害，30%概率灼烧' },
            { name: '炎击', desc: '造成攻击80%伤害，50%概率灼烧' }
        ],
        special: [
            { name: '大火球', desc: '造成攻击200%伤害，必定灼烧', cost: 30 },
            { name: '炎爆术', desc: '对全体造成攻击120%伤害，必定灼烧', cost: 40 }
        ],
        passive: [
            { name: '燃烧之心', desc: '灼烧伤害+40%，持续时间+1' },
            { name: '余烬', desc: '击杀敌人时，对相邻敌人附加灼烧' }
        ]
    },
    [CardArchetype.STUN]: {
        normal: [
            { name: '重击', desc: '造成攻击90%伤害，20%概率眩晕' },
            { name: '震荡', desc: '造成攻击80%伤害，30%概率眩晕' }
        ],
        special: [
            { name: '雷霆一击', desc: '造成攻击150%伤害，必定眩晕', cost: 35 },
            { name: '群体震慑', desc: '对前排造成攻击100%伤害，50%眩晕', cost: 30 }
        ],
        passive: [
            { name: '控制大师', desc: '眩晕概率+15%，眩晕持续时间+1' },
            { name: '震慑', desc: '攻击眩晕目标时，伤害+50%' }
        ]
    },
    [CardArchetype.DODGE]: {
        normal: [
            { name: '闪击', desc: '造成攻击95%伤害，自身闪避+10%持续1回合' },
            { name: '灵巧', desc: '造成攻击85%伤害，闪避+15%' }
        ],
        special: [
            { name: '幻影', desc: '闪避+50%持续2回合，下次攻击必暴击', cost: 25 },
            { name: '消失', desc: '闪避+100%持续1回合，无法被选中', cost: 30 }
        ],
        passive: [
            { name: '闪避大师', desc: '闪避率+25%，闪避后下次攻击+50%伤害' },
            { name: '残影', desc: '受到攻击时，30%概率完全闪避' }
        ]
    },
    [CardArchetype.SHIELD]: {
        normal: [
            { name: '盾击', desc: '造成攻击80%伤害，自身获得护盾' },
            { name: '守护', desc: '造成攻击70%伤害，嘲讽目标' }
        ],
        special: [
            { name: '铁壁', desc: '获得最大生命50%护盾，防御+50%', cost: 30 },
            { name: '守护天使', desc: '为全体队友获得护盾', cost: 35 }
        ],
        passive: [
            { name: '坚盾', desc: '护盾效果+30%，护盾存在时防御+30%' },
            { name: '反击', desc: '受到攻击时，反弹30%伤害' }
        ]
    },
    [CardArchetype.HEAL]: {
        normal: [
            { name: '治疗', desc: '为生命最低的队友恢复攻击80%生命' },
            { name: '治愈', desc: '为全体恢复攻击40%生命' }
        ],
        special: [
            { name: '大治疗', desc: '恢复攻击150%生命，清除所有debuff', cost: 35 },
            { name: '复活', desc: '复活一名阵亡队友，恢复50%生命', cost: 50 }
        ],
        passive: [
            { name: '治疗强化', desc: '治疗效果+30%，每回合自动恢复生命' },
            { name: '医者', desc: '治疗时，目标防御+20%持续2回合' }
        ]
    },
    [CardArchetype.EXECUTE]: {
        normal: [
            { name: '收割', desc: '造成攻击100%伤害，对残血敌人伤害+30%' },
            { name: '处决', desc: '造成攻击90%伤害，目标生命越低伤害越高' }
        ],
        special: [
            { name: '斩杀', desc: '对生命低于30%敌人造成300%伤害，否则150%', cost: 35 },
            { name: '死神之镰', desc: '无视防御造成攻击200%伤害', cost: 40 }
        ],
        passive: [
            { name: '收割者', desc: '对生命低于50%敌人，伤害+50%' },
            { name: '终结', desc: '击杀敌人时，立即获得1次额外行动' }
        ]
    },
    [CardArchetype.DRAIN]: {
        normal: [
            { name: '吸血', desc: '造成攻击90%伤害，恢复造成伤害30%生命' },
            { name: '生命偷取', desc: '造成攻击80%伤害，恢复40%生命' }
        ],
        special: [
            { name: '鲜血狂欢', desc: '造成攻击150%伤害，恢复100%生命', cost: 30 },
            { name: '生命虹吸', desc: '造成攻击120%伤害，恢复150%生命', cost: 35 }
        ],
        passive: [
            { name: '吸血鬼', desc: '造成伤害的20%转化为生命恢复' },
            { name: '血之渴望', desc: '生命低于50%时，吸血效果+30%' }
        ]
    },
    [CardArchetype.AOE]: {
        normal: [
            { name: '横扫', desc: '对前排造成攻击80%伤害' },
            { name: '飞弹', desc: '随机2个敌人造成攻击70%伤害' }
        ],
        special: [
            { name: '全屏攻击', desc: '对全体造成攻击150%伤害', cost: 40 },
            { name: '毁灭', desc: '对全体造成攻击200%伤害，自身眩晕1回合', cost: 50 }
        ],
        passive: [
            { name: '范围强化', desc: '范围伤害+30%，暴击时伤害额外+20%' },
            { name: '溅射', desc: '单体攻击有50%概率对相邻敌人造成50%溅射伤害' }
        ]
    },
    [CardArchetype.BUFF]: {
        normal: [
            { name: '鼓舞', desc: '为攻击最高的队友加攻击20%持续2回合' },
            { name: '守护', desc: '为生命最低的队友加防御30%持续2回合' }
        ],
        special: [
            { name: '全体强化', desc: '全体攻击+30%，防御+30%持续3回合', cost: 35 },
            { name: '狂暴', desc: '一名队友攻击+100%，暴击率+50%持续2回合', cost: 40 }
        ],
        passive: [
            { name: '增益大师', desc: '增益效果+20%，持续时间+1' },
            { name: '团队核心', desc: '战斗开始时，全体获得随机增益' }
        ]
    },
    [CardArchetype.REFLECT]: {
        normal: [
            { name: '反弹', desc: '造成攻击80%伤害，获得反弹护盾' },
            { name: '反伤', desc: '造成攻击70%伤害，反弹率+30%' }
        ],
        special: [
            { name: '镜面', desc: '反弹100%伤害持续2回合', cost: 30 },
            { name: '反噬', desc: '反弹150%伤害，自身获得护盾', cost: 35 }
        ],
        passive: [
            { name: '荆棘', desc: '受到攻击反弹50%伤害' },
            { name: '镜花水月', desc: '闪避后，反弹伤害+100%持续1回合' }
        ]
    },
    [CardArchetype.FREEZE]: {
        normal: [
            { name: '冰冻', desc: '造成攻击85%伤害，25%冰冻' },
            { name: '霜冻', desc: '造成攻击75%伤害，35%冰冻' }
        ],
        special: [
            { name: '冰封', desc: '造成攻击150%伤害，必定冰冻', cost: 35 },
            { name: '暴风雪', desc: '对全体造成攻击100%伤害，30%冰冻', cost: 40 }
        ],
        passive: [
            { name: '极寒', desc: '冰冻概率+20%，冰冻目标受到伤害+30%' },
            { name: '冰霜之心', desc: '攻击冰冻目标时，恢复生命' }
        ]
    },
    [CardArchetype.REGEN]: {
        normal: [
            { name: '恢复', desc: '恢复生命，下回合额外恢复' },
            { name: '愈合', desc: '持续恢复生命3回合' }
        ],
        special: [
            { name: '再生', desc: '每回合恢复最大生命20%持续5回合', cost: 30 },
            { name: '不死之身', desc: '5回合内，受到致命伤害保留1血', cost: 45 }
        ],
        passive: [
            { name: '再生', desc: '每回合恢复最大生命5%' },
            { name: '活力', desc: '生命上限+20%，恢复效果+30%' }
        ]
    },
    [CardArchetype.SILENCE]: {
        normal: [
            { name: '封印', desc: '造成攻击85%伤害，20%沉默' },
            { name: '禁言', desc: '造成攻击75%伤害，30%沉默' }
        ],
        special: [
            { name: '绝对封印', desc: '造成攻击120%伤害，必定沉默', cost: 35 },
            { name: '沉默领域', desc: '对全体造成攻击80%伤害，30%沉默', cost: 40 }
        ],
        passive: [
            { name: '封魔', desc: '沉默概率+20%，沉默目标受到伤害+40%' },
            { name: '魔导', desc: '攻击沉默目标时，自身能量+20' }
        ]
    },
    [CardArchetype.TAUNT]: {
        normal: [
            { name: '嘲讽', desc: '造成攻击80%伤害，嘲讽目标' },
            { name: '挑衅', desc: '造成攻击70%伤害，50%嘲讽' }
        ],
        special: [
            { name: '全体嘲讽', desc: '嘲讽全体敌人，防御+50%', cost: 35 },
            { name: '绝对守护', desc: '队友受到伤害的50%转移到自身', cost: 40 }
        ],
        passive: [
            { name: '铁壁', desc: '被攻击时防御+30%，反弹20%伤害' },
            { name: '守护', desc: '嘲讽期间，队友受到伤害-30%' }
        ]
    },
    [CardArchetype.REVIVE]: {
        normal: [
            { name: '救赎', desc: '恢复生命，若有阵亡队友恢复量+50%' },
            { name: '祝福', desc: '为队友附加复活标记' }
        ],
        special: [
            { name: '复活', desc: '复活一名队友，恢复100%生命', cost: 50 },
            { name: '群体复活', desc: '复活所有阵亡队友，恢复50%生命', cost: 70 }
        ],
        passive: [
            { name: '不死', desc: '受到致命伤害时，保留1血并恢复30%生命（每场1次）' },
            { name: '轮回', desc: '死亡后立即复活，恢复50%生命（每场1次）' }
        ]
    },
    [CardArchetype.SACRIFICE]: {
        normal: [
            { name: '血祭', desc: '消耗10%生命，造成攻击130%伤害' },
            { name: '燃烧生命', desc: '消耗15%生命，攻击+50%持续2回合' }
        ],
        special: [
            { name: '自爆', desc: '消耗50%生命，造成攻击300%伤害', cost: 30 },
            { name: '终极献祭', desc: '牺牲自己，对全体造成攻击500%伤害', cost: 50 }
        ],
        passive: [
            { name: '血怒', desc: '生命每降低10%，伤害+10%' },
            { name: '回光', desc: '生命低于20%时，攻击+100%，吸血+50%' }
        ]
    },
    [CardArchetype.SUMMON]: {
        normal: [
            { name: '召唤', desc: '造成攻击80%伤害，召唤1个小怪' },
            { name: '援军', desc: '召唤2个弱小的援军' }
        ],
        special: [
            { name: '大军', desc: '召唤3个强力援军', cost: 40 },
            { name: '召唤兽', desc: '召唤1个强大的召唤兽', cost: 45 }
        ],
        passive: [
            { name: '召唤大师', desc: '召唤物属性+30%，存在上限+1' },
            { name: '人海', desc: '每有一个召唤物，自身攻击+10%' }
        ]
    },
    [CardArchetype.COPY]: {
        normal: [
            { name: '模仿', desc: '造成攻击90%伤害，复制目标1个buff' },
            { name: '镜像', desc: '下次受到的技能由攻击者承担' }
        ],
        special: [
            { name: '完美复制', desc: '复制目标最后使用的技能', cost: 40 },
            { name: '反弹', desc: '反弹下一次受到的技能，伤害+50%', cost: 35 }
        ],
        passive: [
            { name: '模仿大师', desc: '复制的技能伤害+30%，buff效果+50%' },
            { name: '镜花水月', desc: '受到debuff时，50%概率反弹给施法者' }
        ]
    },
    [CardArchetype.BURST]: {
        normal: [
            { name: '蓄力', desc: '造成攻击70%伤害，获得1层蓄力' },
            { name: '充能', desc: '下回合伤害+30%' }
        ],
        special: [
            { name: '爆发', desc: '消耗所有蓄力，每层+100%伤害', cost: 30 },
            { name: '终极爆发', desc: '造成攻击400%伤害，眩晕1回合', cost: 40 }
        ],
        passive: [
            { name: '蓄力', desc: '每回合获得1层蓄力，最多5层' },
            { name: '爆发大师', desc: '蓄力上限+2，每层蓄力+30%暴击伤害' }
        ]
    }
};

// 生成随机名字
function generateName(element: ElementType, archetype: CardArchetype): { name: string; title: string } {
    const elementKey = element.toLowerCase() as keyof typeof NAME_COMPONENTS.prefixes;
    const prefixes = NAME_COMPONENTS.prefixes[elementKey];
    const names = NAME_COMPONENTS.names[elementKey];
    const titles = NAME_COMPONENTS.titles[elementKey];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    return {
        name: prefix + name,
        title: title
    };
}

// 根据稀有度决定基础属性
function generateBaseStats(rarity: Rarity, archetype: CardArchetype): {
    hp: number; atk: number; def: number; spd: number;
    crt: number; cdmg: number; acc: number; res: number;
} {
    // 基础属性系数
    const rarityMultiplier = {
        [Rarity.GREEN]: 1.0,
        [Rarity.BLUE]: 1.2,
        [Rarity.PURPLE]: 1.5,
        [Rarity.GOLD]: 1.8,
        [Rarity.RED]: 2.2,
        [Rarity.RAINBOW]: 2.8
    };
    
    const multiplier = rarityMultiplier[rarity] || 1.0;
    
    // 根据流派调整属性倾向
    const archetypeStats: Record<CardArchetype, Partial<ReturnType<typeof generateBaseStats>>> = {
        [CardArchetype.CRIT]: { crt: 20, cdmg: 180 },
        [CardArchetype.COMBO]: { spd: 120 },
        [CardArchetype.POISON]: { acc: 20 },
        [CardArchetype.BURN]: { acc: 20 },
        [CardArchetype.STUN]: { acc: 20 },
        [CardArchetype.DODGE]: { spd: 115 },
        [CardArchetype.SHIELD]: { def: 1.3, hp: 1.3 },
        [CardArchetype.HEAL]: { res: 25 },
        [CardArchetype.EXECUTE]: { crt: 15, spd: 110 },
        [CardArchetype.DRAIN]: { atk: 1.1 },
        [CardArchetype.AOE]: { atk: 0.95 },
        [CardArchetype.BUFF]: { res: 20 },
        [CardArchetype.REFLECT]: { def: 1.2, hp: 1.2 },
        [CardArchetype.FREEZE]: { acc: 20 },
        [CardArchetype.REGEN]: { hp: 1.3, def: 1.2 },
        [CardArchetype.SILENCE]: { acc: 20 },
        [CardArchetype.TAUNT]: { def: 1.4, hp: 1.4 },
        [CardArchetype.REVIVE]: { res: 25 },
        [CardArchetype.SACRIFICE]: { atk: 1.3 },
        [CardArchetype.SUMMON]: { atk: 0.9, hp: 1.1 },
        [CardArchetype.COPY]: { res: 20 },
        [CardArchetype.BURST]: { crt: 10, cdmg: 170 }
    };
    
    const archetypeBonus = archetypeStats[archetype] || {};
    
    return {
        hp: Math.floor((2500 + Math.random() * 500) * (archetypeBonus.hp || 1) * multiplier),
        atk: Math.floor((280 + Math.random() * 60) * (archetypeBonus.atk || 1) * multiplier),
        def: Math.floor((160 + Math.random() * 40) * (archetypeBonus.def || 1) * multiplier),
        spd: Math.floor((95 + Math.random() * 20) * (archetypeBonus.spd || 1) / 100),
        crt: archetypeBonus.crt || 10,
        cdmg: archetypeBonus.cdmg || 150,
        acc: archetypeBonus.acc || 0,
        res: archetypeBonus.res || 10
    };
}

// 生成单张卡牌
function generateCard(
    id: string,
    element: ElementType,
    rarity: Rarity,
    archetype: CardArchetype
): CardData {
    const { name, title } = generateName(element, archetype);
    const stats = generateBaseStats(rarity, archetype);
    const templates = SKILL_TEMPLATES[archetype];
    
    // 随机选择技能
    const normalSkill = templates.normal[Math.floor(Math.random() * templates.normal.length)];
    const specialSkill = templates.special[Math.floor(Math.random() * templates.special.length)];
    const passiveSkill = templates.passive[Math.floor(Math.random() * templates.passive.length)];
    
    return {
        id,
        name,
        title,
        rarity,
        element,
        art: {
            portrait: `images/cards/${id}_portrait.bmp`,
            fullbody: `images/cards/${id}_full.bmp`,
            awakened: rarity >= Rarity.PURPLE ? `images/cards/${id}_awaken.bmp` : undefined
        },
        story: {
            summary: `${getArchetypeDescription(archetype)}的${getElementName(element)}属性角色`,
            background: `这是一位掌握${getArchetypeName(archetype)}之力的${getElementName(element)}属性战士。`,
            memory1: '记忆片段1：初次觉醒力量',
            memory2: '记忆片段2：经历重大战斗',
            memory3: '记忆片段3：突破自我极限'
        },
        skills: {
            normal: {
                id: `${id}_normal`,
                name: normalSkill.name,
                description: normalSkill.desc,
                icon: `skills/${archetype}_normal.bmp`,
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 100
                }]
            },
            special: {
                id: `${id}_special`,
                name: specialSkill.name,
                description: specialSkill.desc,
                icon: `skills/${archetype}_special.bmp`,
                cost: specialSkill.cost,
                cooldown: 3,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 150
                }]
            },
            passive: rarity >= Rarity.BLUE ? {
                id: `${id}_passive`,
                name: passiveSkill.name,
                description: passiveSkill.desc,
                icon: `skills/${archetype}_passive.bmp`,
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'buff_atk' as any,
                    target: 'self' as any,
                    value: 10
                }]
            } : undefined
        },
        baseStats: {
            hp: stats.hp,
            atk: stats.atk,
            def: stats.def,
            spd: stats.spd,
            crt: stats.crt,
            cdmg: stats.cdmg,
            acc: stats.acc,
            res: stats.res
        },
        growth: {
            hp: Math.floor(stats.hp * 0.07),
            atk: Math.floor(stats.atk * 0.07),
            def: Math.floor(stats.def * 0.07),
            spd: Math.floor(stats.spd * 0.015)
        }
    };
}

// 辅助函数
function getArchetypeDescription(archetype: CardArchetype): string {
    const descs: Record<CardArchetype, string> = {
        [CardArchetype.CRIT]: '追求暴击伤害',
        [CardArchetype.COMBO]: '快速连击',
        [CardArchetype.POISON]: '使用毒素',
        [CardArchetype.BURN]: '使用火焰',
        [CardArchetype.STUN]: '擅长控制',
        [CardArchetype.DODGE]: '灵活闪避',
        [CardArchetype.SHIELD]: '坚不可摧',
        [CardArchetype.HEAL]: '治疗支援',
        [CardArchetype.EXECUTE]: '斩杀收割',
        [CardArchetype.DRAIN]: '以战养战',
        [CardArchetype.AOE]: '范围打击',
        [CardArchetype.BUFF]: '增益辅助',
        [CardArchetype.REFLECT]: '反弹伤害',
        [CardArchetype.FREEZE]: '冰冻控制',
        [CardArchetype.REGEN]: '持续恢复',
        [CardArchetype.SILENCE]: '封印技能',
        [CardArchetype.TAUNT]: '保护队友',
        [CardArchetype.REVIVE]: '复活队友',
        [CardArchetype.SACRIFICE]: '燃烧生命',
        [CardArchetype.SUMMON]: '召唤援军',
        [CardArchetype.COPY]: '模仿复制',
        [CardArchetype.BURST]: '瞬间爆发'
    };
    return descs[archetype] || '神秘';
}

function getArchetypeName(archetype: CardArchetype): string {
    const names: Record<CardArchetype, string> = {
        [CardArchetype.CRIT]: '暴击',
        [CardArchetype.COMBO]: '连击',
        [CardArchetype.POISON]: '毒素',
        [CardArchetype.BURN]: '灼烧',
        [CardArchetype.STUN]: '眩晕',
        [CardArchetype.DODGE]: '闪避',
        [CardArchetype.SHIELD]: '护盾',
        [CardArchetype.HEAL]: '治疗',
        [CardArchetype.EXECUTE]: '斩杀',
        [CardArchetype.DRAIN]: '吸血',
        [CardArchetype.AOE]: '群攻',
        [CardArchetype.BUFF]: '增益',
        [CardArchetype.REFLECT]: '反弹',
        [CardArchetype.FREEZE]: '冰冻',
        [CardArchetype.REGEN]: '回复',
        [CardArchetype.SILENCE]: '沉默',
        [CardArchetype.TAUNT]: '嘲讽',
        [CardArchetype.REVIVE]: '复活',
        [CardArchetype.SACRIFICE]: '献祭',
        [CardArchetype.SUMMON]: '召唤',
        [CardArchetype.COPY]: '复制',
        [CardArchetype.BURST]: '爆发'
    };
    return names[archetype] || archetype;
}

function getElementName(element: ElementType): string {
    const names: Record<ElementType, string> = {
        [ElementType.METAL]: '金',
        [ElementType.WOOD]: '木',
        [ElementType.WATER]: '水',
        [ElementType.FIRE]: '火',
        [ElementType.EARTH]: '土',
        [ElementType.LIGHT]: '光',
        [ElementType.DARK]: '暗'
    };
    return names[element] || element;
}

// 主生成函数
export function generateAllCards(): CardData[] {
    const allCards: CardData[] = [];
    const archetypes = Object.values(CardArchetype);
    
    // 五行元素
    const fiveElements = [
        ElementType.METAL,
        ElementType.WOOD,
        ElementType.WATER,
        ElementType.FIRE,
        ElementType.EARTH
    ];
    
    // 为每个五行元素生成100张卡牌
    fiveElements.forEach((element, elementIndex) => {
        // 计算各品质数量
        const greenCount = 40;
        const blueCount = 30;
        const purpleCount = 15;
        const goldCount = 10;
        const redCount = 5;
        
        let cardIndex = 0;
        
        // 绿色卡牌
        for (let i = 0; i < greenCount; i++) {
            const archetype = archetypes[cardIndex % archetypes.length];
            allCards.push(generateCard(
                `${element}_${cardIndex + 1}`,
                element,
                Rarity.GREEN,
                archetype
            ));
            cardIndex++;
        }
        
        // 蓝色卡牌
        for (let i = 0; i < blueCount; i++) {
            const archetype = archetypes[cardIndex % archetypes.length];
            allCards.push(generateCard(
                `${element}_${cardIndex + 1}`,
                element,
                Rarity.BLUE,
                archetype
            ));
            cardIndex++;
        }
        
        // 紫色卡牌
        for (let i = 0; i < purpleCount; i++) {
            const archetype = archetypes[cardIndex % archetypes.length];
            allCards.push(generateCard(
                `${element}_${cardIndex + 1}`,
                element,
                Rarity.PURPLE,
                archetype
            ));
            cardIndex++;
        }
        
        // 金色卡牌
        for (let i = 0; i < goldCount; i++) {
            const archetype = archetypes[cardIndex % archetypes.length];
            allCards.push(generateCard(
                `${element}_${cardIndex + 1}`,
                element,
                Rarity.GOLD,
                archetype
            ));
            cardIndex++;
        }
        
        // 红色卡牌
        for (let i = 0; i < redCount; i++) {
            const archetype = archetypes[cardIndex % archetypes.length];
            allCards.push(generateCard(
                `${element}_${cardIndex + 1}`,
                element,
                Rarity.RED,
                archetype
            ));
            cardIndex++;
        }
    });
    
    // 光暗元素各50张（最低红色）
    [ElementType.LIGHT, ElementType.DARK].forEach((element, elementIndex) => {
        // 红色45张
        for (let i = 0; i < 45; i++) {
            const archetype = archetypes[i % archetypes.length];
            allCards.push(generateCard(
                `${element}_${i + 1}`,
                element,
                Rarity.RED,
                archetype
            ));
        }
        
        // 彩色5张
        for (let i = 0; i < 5; i++) {
            const archetype = archetypes[i % archetypes.length];
            allCards.push(generateCard(
                `${element}_rainbow_${i + 1}`,
                element,
                Rarity.RAINBOW,
                archetype
            ));
        }
    });
    
    return allCards;
}

// 导出为JSON文件（用于调试）
export function exportCardsToJSON(): string {
    const cards = generateAllCards();
    return JSON.stringify(cards, null, 2);
}

// 统计信息
export function generateStatistics(): {
    totalCards: number;
    byElement: Record<ElementType, number>;
    byRarity: Record<Rarity, number>;
    byArchetype: Record<CardArchetype, number>;
} {
    const cards = generateAllCards();
    
    const byElement: Record<ElementType, number> = {} as any;
    const byRarity: Record<Rarity, number> = {} as any;
    const byArchetype: Record<CardArchetype, number> = {} as any;
    
    cards.forEach(card => {
        byElement[card.element] = (byElement[card.element] || 0) + 1;
        byRarity[card.rarity] = (byRarity[card.rarity] || 0) + 1;
        // 统计流派需要从技能反推，简化处理
    });
    
    return {
        totalCards: cards.length,
        byElement,
        byRarity,
        byArchetype
    };
}

// 如果直接运行此文件
if (typeof window === 'undefined') {
    const stats = generateStatistics();
    console.log('卡牌生成统计：');
    console.log(`总卡牌数: ${stats.totalCards}`);
    console.log('\n按元素分布：');
    Object.entries(stats.byElement).forEach(([element, count]) => {
        console.log(`  ${getElementName(element as ElementType)}: ${count}张`);
    });
    console.log('\n按稀有度分布：');
    Object.entries(stats.byRarity).forEach(([rarity, count]) => {
        const rarityNames = ['绿色', '蓝色', '紫色', '金色', '红色', '彩色'];
        console.log(`  ${rarityNames[parseInt(rarity) - 1]}: ${count}张`);
    });
}