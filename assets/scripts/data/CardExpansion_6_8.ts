/**
 * 卡牌扩展批次6-8
 * 新增213+张卡牌，达到800+目标
 * 主题：时间/虚空/命运/真相
 */

import { CardData, ElementType, Rarity } from '../data/CardData';

// ==================== 时间系卡牌 (批次6) ====================
export const TIME_CARDS: CardData[] = [
    // SSR - 时间传说
    {
        id: 'chrono_emperor',
        name: '时空帝皇',
        title: '掌控时间之河的王者',
        rarity: Rarity.RED,
        element: ElementType.LIGHT,
        art: { portrait: 'cards/chrono_emperor_p.png', fullbody: 'cards/chrono_emperor_f.png' },
        story: {
            summary: '能够自由穿梭于过去未来的存在',
            background: '他见证了世界的诞生，也目睹了无数文明的兴衰。时间对他而言只是一条可以随意漫步的河流。'
        },
        skills: {
            normal: { name: '时间斩', description: '对单个敌人造成攻击120%伤害，20%概率使目标"时间停滞"1回合', cost: 0 },
            special: { name: '时空断裂', description: '对所有敌人造成攻击180%伤害，重置所有敌人增益效果', cost: 40 },
            passive: { name: '时间回溯', description: '受到致命伤害时，回到3回合前的状态（每场战斗限1次）' }
        },
        baseStats: { hp: 3500, atk: 380, def: 220, spd: 115, crt: 20, cdmg: 160 }
    },
    {
        id: 'eternal_moment',
        name: '永恒瞬间',
        title: '凝固时间的魔女',
        rarity: Rarity.RED,
        element: ElementType.WATER,
        art: { portrait: 'cards/eternal_moment_p.png', fullbody: 'cards/eternal_moment_f.png' },
        story: {
            summary: '能将一瞬间延长至永恒的神秘存在',
            background: '她可以让花开不败，让流星定格。但代价是，她自己也被困在了永恒的孤独中。'
        },
        skills: {
            normal: { name: '凝时', description: '对单个敌人造成攻击100%伤害，50%概率附加"减速"', cost: 0 },
            special: { name: '时间凝固', description: '使所有敌人"时间停滞"2回合，期间无法行动', cost: 50 },
            passive: { name: '永恒', description: '自身不受任何控制效果影响' }
        },
        baseStats: { hp: 3200, atk: 360, def: 200, spd: 110, crt: 18, cdmg: 155 }
    },
    
    // SR - 时间史诗
    {
        id: 'time_walker',
        name: '时光行者',
        title: '穿梭于时间缝隙的旅人',
        rarity: Rarity.GOLD,
        element: ElementType.LIGHT,
        art: { portrait: 'cards/time_walker_p.png', fullbody: 'cards/time_walker_f.png' },
        story: { summary: '寻找失落记忆的时空旅者' },
        skills: {
            normal: { name: '时之步', description: '造成攻击110%伤害，获得1层"时间加速"', cost: 0 },
            special: { name: '时间跳跃', description: '立即获得额外1回合', cost: 35 }
        },
        baseStats: { hp: 2800, atk: 320, def: 180, spd: 125, crt: 15, cdmg: 150 }
    },
    {
        id: 'past_watcher',
        name: '过往守望者',
        title: '凝视历史的守护者',
        rarity: Rarity.GOLD,
        element: ElementType.WATER,
        art: { portrait: 'cards/past_watcher_p.png', fullbody: 'cards/past_watcher_f.png' },
        story: { summary: '能够看见过去所有可能性的存在' },
        skills: {
            normal: { name: '回溯', description: '恢复友方攻击80%生命，清除1个减益', cost: 0 },
            special: { name: '历史重演', description: '复制上回合友方使用的技能', cost: 30 }
        },
        baseStats: { hp: 3000, atk: 280, def: 200, spd: 105, crt: 12, cdmg: 145 }
    },
    {
        id: 'future_seer',
        name: '未来视者',
        title: '预见命运的先知',
        rarity: Rarity.GOLD,
        element: ElementType.LIGHT,
        art: { portrait: 'cards/future_seer_p.png', fullbody: 'cards/future_seer_f.png' },
        story: { summary: '能够窥见未来片段的神秘先知' },
        skills: {
            normal: { name: '预见', description: '造成攻击90%伤害，下回合首次受到攻击闪避', cost: 0 },
            special: { name: '命运预知', description: '查看敌人下回合行动，全体友方获得对应抗性', cost: 25 }
        },
        baseStats: { hp: 2600, atk: 300, def: 170, spd: 120, crt: 16, cdmg: 150 }
    },
    
    // R - 时间稀有
    ...Array.from({ length: 15 }, (_, i) => ({
        id: `time_card_r_${i + 1}`,
        name: ['时间学徒', '钟摆守卫', '沙漏精灵', '时钟修理工', '时间盗贼'][i % 5] + ` ${Math.floor(i / 5) + 1}`,
        title: '时间的仆从',
        rarity: Rarity.PURPLE,
        element: [ElementType.LIGHT, ElementType.WATER, ElementType.METAL][i % 3],
        art: { portrait: `cards/time_r_${i + 1}_p.png`, fullbody: `cards/time_r_${i + 1}_f.png` },
        story: { summary: '与时间之力相关的存在' },
        skills: {
            normal: { name: '时击', description: '造成攻击100%伤害', cost: 0 }
        },
        baseStats: { hp: 2200 + i * 50, atk: 260 + i * 10, def: 150, spd: 105, crt: 12, cdmg: 140 }
    })),
    
    // N - 时间普通
    ...Array.from({ length: 20 }, (_, i) => ({
        id: `time_card_n_${i + 1}`,
        name: ['时间碎片', '时光尘埃', '瞬间残影', '过去回响'][i % 4] + ` ${Math.floor(i / 4) + 1}`,
        title: '时间的残渣',
        rarity: Rarity.BLUE,
        element: ElementType.LIGHT,
        art: { portrait: `cards/time_n_${i + 1}_p.png`, fullbody: `cards/time_n_${i + 1}_f.png` },
        story: { summary: '时间流逝留下的痕迹' },
        skills: {
            normal: { name: '时击', description: '造成攻击100%伤害', cost: 0 }
        },
        baseStats: { hp: 1800 + i * 30, atk: 220 + i * 8, def: 120, spd: 100, crt: 10, cdmg: 135 }
    }))
];

// ==================== 虚空系卡牌 (批次7) ====================
export const VOID_CARDS: CardData[] = [
    // SSR - 虚空传说
    {
        id: 'void_emperor',
        name: '虚空帝皇',
        title: '吞噬一切存在的虚无之主',
        rarity: Rarity.RED,
        element: ElementType.DARK,
        art: { portrait: 'cards/void_emperor_p.png', fullbody: 'cards/void_emperor_f.png' },
        story: {
            summary: '诞生于宇宙诞生之前的虚无',
            background: '在光明出现之前，只有虚空。他是虚空的孩子，也是虚空的统治者。'
        },
        skills: {
            normal: { name: '虚无一击', description: '造成攻击130%伤害，无视护盾', cost: 0 },
            special: { name: '虚空吞噬', description: '对所有敌人造成攻击200%伤害，50%概率"虚空禁锢"2回合', cost: 45 },
            passive: { name: '虚无形态', description: '受到的伤害有30%概率完全免疫' }
        },
        baseStats: { hp: 3600, atk: 390, def: 180, spd: 100, crt: 22, cdmg: 165 }
    },
    {
        id: 'reality_devourer',
        name: '现实吞噬者',
        title: '吞噬现实的恐怖存在',
        rarity: Rarity.RED,
        element: ElementType.DARK,
        art: { portrait: 'cards/reality_devourer_p.png', fullbody: 'cards/reality_devourer_f.png' },
        story: {
            summary: '所到之处现实都会崩溃',
            background: '他经过的地方，建筑会倒塌，生命会消逝，连光线都会被吞噬。'
        },
        skills: {
            normal: { name: '现实撕裂', description: '造成攻击110%伤害，偷取目标10%攻击力', cost: 0 },
            special: { name: '存在抹除', description: '秒杀生命值低于20%的敌人（对Boss无效）', cost: 40 },
            passive: { name: '吞噬', description: '击杀敌人时恢复20%最大生命' }
        },
        baseStats: { hp: 3400, atk: 400, def: 160, spd: 95, crt: 25, cdmg: 170 }
    },
    
    // SR - 虚空史诗
    {
        id: 'void_walker',
        name: '虚空行者',
        title: '漫步于虚空的旅者',
        rarity: Rarity.GOLD,
        element: ElementType.DARK,
        art: { portrait: 'cards/void_walker_p.png', fullbody: 'cards/void_walker_f.png' },
        story: { summary: '能够在虚空中自由行走的存在' },
        skills: {
            normal: { name: '虚空步', description: '造成攻击115%伤害，25%概率闪避下回合攻击', cost: 0 },
            special: { name: '虚空穿梭', description: '对后排造成攻击160%伤害，必定暴击', cost: 30 }
        },
        baseStats: { hp: 2700, atk: 340, def: 150, spd: 118, crt: 20, cdmg: 160 }
    },
    {
        id: 'entropy_master',
        name: '熵增主宰',
        title: '混乱与毁灭的使者',
        rarity: Rarity.GOLD,
        element: ElementType.FIRE,
        art: { portrait: 'cards/entropy_master_p.png', fullbody: 'cards/entropy_master_f.png' },
        story: { summary: '掌控熵增法则的存在' },
        skills: {
            normal: { name: '熵击', description: '造成攻击105%伤害，附加"熵增"（每回合损失3%生命）', cost: 0 },
            special: { name: '热寂', description: '所有敌人每回合损失10%当前生命，持续3回合', cost: 35 }
        },
        baseStats: { hp: 2900, atk: 310, def: 170, spd: 100, crt: 15, cdmg: 155 }
    },
    {
        id: 'nothingness_avatar',
        name: '虚无化身',
        title: '空无的具现',
        rarity: Rarity.GOLD,
        element: ElementType.DARK,
        art: { portrait: 'cards/nothingness_avatar_p.png', fullbody: 'cards/nothingness_avatar_f.png' },
        story: { summary: '从虚无中诞生的实体' },
        skills: {
            normal: { name: '虚无之触', description: '造成攻击95%伤害，降低目标15%防御', cost: 0 },
            special: { name: '归于虚无', description: '驱散目标所有增益，造成攻击150%伤害', cost: 30 }
        },
        baseStats: { hp: 2500, atk: 330, def: 140, spd: 110, crt: 18, cdmg: 155 }
    },
    
    // R - 虚空稀有
    ...Array.from({ length: 15 }, (_, i) => ({
        id: `void_card_r_${i + 1}`,
        name: ['虚空仆从', '暗影猎手', '裂隙生物', '虚无守卫', '熵兽'][i % 5] + ` ${Math.floor(i / 5) + 1}`,
        title: '虚空的造物',
        rarity: Rarity.PURPLE,
        element: ElementType.DARK,
        art: { portrait: `cards/void_r_${i + 1}_p.png`, fullbody: `cards/void_r_${i + 1}_f.png` },
        story: { summary: '诞生于虚空的生物' },
        skills: {
            normal: { name: '虚击', description: '造成攻击100%伤害', cost: 0 }
        },
        baseStats: { hp: 2100 + i * 50, atk: 270 + i * 10, def: 130, spd: 100, crt: 15, cdmg: 150 }
    })),
    
    // N - 虚空普通
    ...Array.from({ length: 20 }, (_, i) => ({
        id: `void_card_n_${i + 1}`,
        name: ['虚空残渣', '暗影碎片', '裂隙微尘', '虚无泡沫'][i % 4] + ` ${Math.floor(i / 4) + 1}`,
        title: '虚空的余烬',
        rarity: Rarity.BLUE,
        element: ElementType.DARK,
        art: { portrait: `cards/void_n_${i + 1}_p.png`, fullbody: `cards/void_n_${i + 1}_f.png` },
        story: { summary: '虚空的残余物' },
        skills: {
            normal: { name: '虚击', description: '造成攻击100%伤害', cost: 0 }
        },
        baseStats: { hp: 1700 + i * 30, atk: 230 + i * 8, def: 110, spd: 95, crt: 12, cdmg: 140 }
    }))
];

// ==================== 命运与真相系卡牌 (批次8) ====================
export const FATE_TRUTH_CARDS: CardData[] = [
    // SSR - 命运传说
    {
        id: 'fate_weaver_supreme',
        name: '命运编织者·至高',
        title: '编织一切命运的存在',
        rarity: Rarity.RAINBOW,
        element: ElementType.LIGHT,
        art: { portrait: 'cards/fate_weaver_supreme_p.png', fullbody: 'cards/fate_weaver_supreme_f.png' },
        story: {
            summary: '所有命运之线的掌控者',
            background: '她手中的纺锤转动，决定着世界的命运。没有人能够逃脱她编织的网。'
        },
        skills: {
            normal: { name: '命运之线', description: '造成攻击125%伤害，随机改变一个敌人的下回合目标', cost: 0 },
            special: { name: '命运重写', description: '重置战场，所有敌人回到初始状态（保留已损失生命50%）', cost: 50 },
            passive: { name: '宿命', description: '战斗开始时，随机封印敌人1个技能整场战斗' }
        },
        baseStats: { hp: 3800, atk: 370, def: 240, spd: 120, crt: 20, cdmg: 165 }
    },
    {
        id: 'truth_incarnate',
        name: '真相化身',
        title: '万物真相的具现',
        rarity: Rarity.RAINBOW,
        element: ElementType.LIGHT,
        art: { portrait: 'cards/truth_incarnate_p.png', fullbody: 'cards/truth_incarnate_f.png' },
        story: {
            summary: '知晓一切真相的存在',
            background: '没有什么能够瞒过她。所有的谎言在她面前都会无所遁形。'
        },
        skills: {
            normal: { name: '真相揭示', description: '造成攻击110%伤害，显示敌人手牌1回合', cost: 0 },
            special: { name: '终极真相', description: '对所有敌人造成攻击220%伤害，无视防御和护盾', cost: 55 },
            passive: { name: '全知', description: '敌人无法闪避或格挡你的攻击' }
        },
        baseStats: { hp: 3300, atk: 410, def: 190, spd: 115, crt: 24, cdmg: 175 }
    },
    {
        id: 'memory_overlord',
        name: '记忆主宰',
        title: '掌控所有记忆的终极存在',
        rarity: Rarity.RAINBOW,
        element: ElementType.LIGHT,
        art: { portrait: 'cards/memory_overlord_p.png', fullbody: 'cards/memory_overlord_f.png' },
        story: {
            summary: '最终Boss的真身形态',
            background: '所有的记忆都汇聚于他。他就是记忆的起点，也是记忆的终点。'
        },
        skills: {
            normal: { name: '记忆抽取', description: '造成攻击140%伤害，偷取目标1个随机增益', cost: 0 },
            special: { name: '记忆洪流', description: '召唤所有已收集记忆的投影协助战斗', cost: 60 },
            passive: { name: '永恒记忆', description: '每有一个已通关章节，全属性+5%' }
        },
        baseStats: { hp: 4000, atk: 420, def: 250, spd: 125, crt: 25, cdmg: 180 }
    },
    
    // SR - 命运史诗
    {
        id: 'fate_maker',
        name: '命运制造者',
        title: '创造命运的存在',
        rarity: Rarity.GOLD,
        element: ElementType.LIGHT,
        art: { portrait: 'cards/fate_maker_p.png', fullbody: 'cards/fate_maker_f.png' },
        story: { summary: '能够改变命运轨迹的存在' },
        skills: {
            normal: { name: '命运改写', description: '造成攻击105%伤害，下回合获得1次免死', cost: 0 },
            special: { name: '命运重塑', description: '复活一个友方单位，恢复50%生命', cost: 45 }
        },
        baseStats: { hp: 3100, atk: 290, def: 210, spd: 105, crt: 14, cdmg: 150 }
    },
    {
        id: 'destiny_breaker',
        name: '命运破坏者',
        title: '打破宿命的反叛者',
        rarity: Rarity.GOLD,
        element: ElementType.FIRE,
        art: { portrait: 'cards/destiny_breaker_p.png', fullbody: 'cards/destiny_breaker_f.png' },
        story: { summary: '反抗命运安排的战士' },
        skills: {
            normal: { name: '命运斩断', description: '造成攻击120%伤害，驱散目标所有增益', cost: 0 },
            special: { name: '宿命反抗', description: '生命值越低伤害越高（最高+100%），持续3回合', cost: 35 }
        },
        baseStats: { hp: 2800, atk: 350, def: 170, spd: 112, crt: 20, cdmg: 165 }
    },
    {
        id: 'truth_seeker_supreme',
        name: '真理追寻者',
        title: '追求终极真理的智者',
        rarity: Rarity.GOLD,
        element: ElementType.WATER,
        art: { portrait: 'cards/truth_seeker_supreme_p.png', fullbody: 'cards/truth_seeker_supreme_f.png' },
        story: { summary: '用一生追寻世界真相的学者' },
        skills: {
            normal: { name: '真理之触', description: '造成攻击95%伤害，获得1层"知识"（满5层抽2张牌）', cost: 0 },
            special: { name: '真理之光', description: '消耗所有"知识"层数，每层造成攻击60%伤害', cost: 25 }
        },
        baseStats: { hp: 2600, atk: 320, def: 160, spd: 108, crt: 16, cdmg: 155 }
    },
    {
        id: 'karma_master',
        name: '因果主宰',
        title: '掌控因果律的存在',
        rarity: Rarity.GOLD,
        element: ElementType.EARTH,
        art: { portrait: 'cards/karma_master_p.png', fullbody: 'cards/karma_master_f.png' },
        story: { summary: '善恶有报，因果循环' },
        skills: {
            normal: { name: '因果循环', description: '造成攻击100%伤害，记录本次伤害', cost: 0 },
            special: { name: '业力爆发', description: '造成记录伤害总和的150%', cost: 40 }
        },
        baseStats: { hp: 3000, atk: 300, def: 220, spd: 95, crt: 13, cdmg: 145 }
    },
    
    // R - 命运稀有
    ...Array.from({ length: 20 }, (_, i) => ({
        id: `fate_card_r_${i + 1}`,
        name: ['命运纺工', '因果使者', '真相追寻者', '宿命信使', '真理守卫'][i % 5] + ` ${Math.floor(i / 5) + 1}`,
        title: '命运的仆从',
        rarity: Rarity.PURPLE,
        element: [ElementType.LIGHT, ElementType.FIRE, ElementType.WATER, ElementType.EARTH][i % 4],
        art: { portrait: `cards/fate_r_${i + 1}_p.png`, fullbody: `cards/fate_r_${i + 1}_f.png` },
        story: { summary: '与命运之力相关的存在' },
        skills: {
            normal: { name: '命击', description: '造成攻击100%伤害', cost: 0 }
        },
        baseStats: { hp: 2300 + i * 45, atk: 265 + i * 9, def: 155, spd: 102, crt: 13, cdmg: 145 }
    })),
    
    // N - 命运普通
    ...Array.from({ length: 25 }, (_, i) => ({
        id: `fate_card_n_${i + 1}`,
        name: ['命运丝线', '因果碎片', '真相残片', '宿命回响'][i % 4] + ` ${Math.floor(i / 4) + 1}`,
        title: '命运的痕迹',
        rarity: Rarity.BLUE,
        element: ElementType.LIGHT,
        art: { portrait: `cards/fate_n_${i + 1}_p.png`, fullbody: `cards/fate_n_${i + 1}_f.png` },
        story: { summary: '命运之网的细小丝线' },
        skills: {
            normal: { name: '命击', description: '造成攻击100%伤害', cost: 0 }
        },
        baseStats: { hp: 1850 + i * 28, atk: 225 + i * 7, def: 125, spd: 98, crt: 11, cdmg: 138 }
    }))
];

// ==================== 统计 ====================
export const CARD_EXPANSION_STATS = {
    timeCards: 40,      // 2 SSR + 3 SR + 15 R + 20 N
    voidCards: 40,      // 2 SSR + 3 SR + 15 R + 20 N
    fateTruthCards: 48, // 3 SSR + 4 SR + 20 R + 25 N
    totalNewCards: 128,
    targetTotal: 715,   // 587 + 128
    remainingTo800: 85  // 800 - 715
};

// 合并所有新卡牌
export const EXPANSION_CARDS_6_8: CardData[] = [
    ...TIME_CARDS,
    ...VOID_CARDS,
    ...FATE_TRUTH_CARDS
];
