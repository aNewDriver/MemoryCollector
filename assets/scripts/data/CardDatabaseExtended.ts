/**
 * 扩展卡牌数据库
 * 新增角色，丰富游戏内容
 */

import { CardData, ElementType, Rarity } from './CardData';

// 扩展卡牌数据
export const EXTENDED_CARD_DATABASE: Record<string, CardData> = {
    // ==================== 第二章：遗忘之森 新角色 ====================
    
    // 火属性
    'lie_yan': {
        id: 'lie_yan',
        name: '烈焰',
        title: '森林守卫者',
        rarity: Rarity.EPIC,
        element: ElementType.FIRE,
        art: {
            portrait: 'images/cards/lie_yan_portrait.bmp',
            fullbody: 'images/cards/lie_yan_full.bmp',
            awakened: 'images/cards/lie_yan_awaken.bmp'
        },
        story: {
            summary: '守护森林的火焰精灵，与烬羽有着神秘的联系',
            background: '她是森林深处的火焰化身，守护着最后一片未被遗忘侵蚀的林地。传说她曾是烬羽的同伴，在大遗忘事件中失去了记忆，却获得了操控森林火焰的能力。',
            memory1: '她记得那片燃烧的天空。',
            memory2: '她记得有人曾与她并肩作战。',
            memory3: '她想不起来那个人的面容，只记得他的剑。'
        },
        skills: {
            normal: {
                id: 'lie_yan_normal',
                name: '火羽',
                description: '对单个敌人造成攻击110%的伤害，有40%概率附加[燃烧]',
                icon: 'skills/fire_feather.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 110,
                    chance: 100
                }, {
                    type: 'burn' as any,
                    target: 'single_enemy' as any,
                    value: 25,
                    duration: 2,
                    chance: 40
                }]
            },
            special: {
                id: 'lie_yan_special',
                name: '森罗万象',
                description: '召唤森林之火，对全体敌人造成攻击130%的伤害，每个燃烧的敌人额外造成30%伤害',
                icon: 'skills/forest_fire.png',
                cost: 35,
                cooldown: 3,
                effects: [{
                    type: 'damage' as any,
                    target: 'all_enemies' as any,
                    value: 130
                }]
            },
            passive: {
                id: 'lie_yan_passive',
                name: '共鸣',
                description: '与烬羽同时上场时，双方攻击力提升25%',
                icon: 'skills/resonance.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'buff_atk' as any,
                    target: 'self' as any,
                    value: 25
                }]
            }
        },
        baseStats: {
            hp: 2600,
            atk: 340,
            def: 170,
            spd: 108,
            crt: 18,
            cdmg: 155,
            acc: 0,
            res: 12
        },
        growth: {
            hp: 170,
            atk: 24,
            def: 11,
            spd: 2
        }
    },

    // 水属性
    'xuan_bing': {
        id: 'xuan_bing',
        name: '玄冰',
        title: '冰封的记忆',
        rarity: Rarity.RARE,
        element: ElementType.WATER,
        art: {
            portrait: 'images/cards/xuan_bing_portrait.bmp',
            fullbody: 'images/cards/xuan_bing_full.bmp'
        },
        story: {
            summary: '被冰封在湖底千年的战士，记忆已模糊但战斗本能犹存',
            background: '他不知道自己是谁，不知道自己为何而战。只有手中的冰剑和脑海中模糊的声音指引着他。每当他试图回忆过去，脑袋就会剧痛。'
        },
        skills: {
            normal: {
                id: 'xuan_bing_normal',
                name: '冰刺',
                description: '对单个敌人造成攻击100%的伤害，有30%概率冰冻1回合',
                icon: 'skills/ice_spike.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 100
                }, {
                    type: 'freeze' as any,
                    target: 'single_enemy' as any,
                    value: 1,
                    duration: 1,
                    chance: 30
                }]
            },
            special: {
                id: 'xuan_bing_special',
                name: '绝对零度',
                description: '对前排敌人造成攻击140%的伤害，必定冰冻1回合',
                icon: 'skills/absolute_zero.png',
                cost: 30,
                cooldown: 4,
                effects: [{
                    type: 'damage' as any,
                    target: 'front_row' as any,
                    value: 140
                }, {
                    type: 'freeze' as any,
                    target: 'front_row' as any,
                    value: 1,
                    duration: 1
                }]
            }
        },
        baseStats: {
            hp: 3000,
            atk: 280,
            def: 200,
            spd: 95,
            crt: 8,
            cdmg: 130,
            acc: 15,
            res: 15
        },
        growth: {
            hp: 190,
            atk: 18,
            def: 14,
            spd: 1
        }
    },

    // 风属性
    'fei_yu': {
        id: 'fei_yu',
        name: '飞羽',
        title: '林间的信使',
        rarity: Rarity.COMMON,
        element: ElementType.WIND,
        art: {
            portrait: 'images/cards/fei_yu_portrait.bmp',
            fullbody: 'images/cards/fei_yu_full.bmp'
        },
        story: {
            summary: '穿梭在森林间的少年，为各个据点传递消息',
            background: '他没有强大的力量，但有着最快的速度。在通讯中断的时代，像他这样的信使是各个幸存者据点之间的生命线。'
        },
        skills: {
            normal: {
                id: 'fei_yu_normal',
                name: '风刃',
                description: '对单个敌人造成攻击90%的伤害',
                icon: 'skills/wind_blade_small.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 90
                }]
            },
            special: {
                id: 'fei_yu_special',
                name: '疾风步',
                description: '为全体队友增加速度15%，持续2回合',
                icon: 'skills/gale_step.png',
                cost: 20,
                cooldown: 3,
                effects: [{
                    type: 'buff_spd' as any,
                    target: 'all_allies' as any,
                    value: 15,
                    duration: 2
                }]
            }
        },
        baseStats: {
            hp: 2200,
            atk: 220,
            def: 140,
            spd: 130,
            crt: 12,
            cdmg: 140,
            acc: 0,
            res: 8
        },
        growth: {
            hp: 140,
            atk: 14,
            def: 9,
            spd: 5
        }
    },

    // 土属性
    'gu_teng': {
        id: 'gu_teng',
        name: '古藤',
        title: '千年树灵',
        rarity: Rarity.EPIC,
        element: ElementType.EARTH,
        art: {
            portrait: 'images/cards/gu_teng_portrait.bmp',
            fullbody: 'images/cards/gu_teng_full.bmp',
            awakened: 'images/cards/gu_teng_awaken.bmp'
        },
        story: {
            summary: '森林中最古老的树木成精，见证了无数生死轮回',
            background: '他活了一千年，看过帝国的兴衰，看过文明的毁灭。大遗忘对他而言只是漫长生命中的又一次变迁。他选择守护这片森林，因为这是他的家。',
            memory1: '他记得第一批人类来到这里。',
            memory2: '他记得他们建造的每一座房屋。',
            memory3: '他记得他们离开时留下的每一滴眼泪。'
        },
        skills: {
            normal: {
                id: 'gu_teng_normal',
                name: '缠绕',
                description: '对单个敌人造成攻击95%的伤害，有40%概率缠绕（无法行动）1回合',
                icon: 'skills/entangle.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 95
                }, {
                    type: 'stun' as any,
                    target: 'single_enemy' as any,
                    value: 1,
                    duration: 1,
                    chance: 40
                }]
            },
            special: {
                id: 'gu_teng_special',
                name: '万物生长',
                description: '为全体队友恢复攻击100%的生命，并附加持续恢复效果（每回合恢复30%），持续3回合',
                icon: 'skills/nature_growth.png',
                cost: 40,
                cooldown: 4,
                effects: [{
                    type: 'heal' as any,
                    target: 'all_allies' as any,
                    value: 100
                }, {
                    type: 'heal' as any,
                    target: 'all_allies' as any,
                    value: 30,
                    duration: 3
                }]
            },
            passive: {
                id: 'gu_teng_passive',
                name: '根深蒂固',
                description: '受到的伤害减少15%，每回合开始时恢复5%最大生命',
                icon: 'skills/deep_roots.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'buff_def' as any,
                    target: 'self' as any,
                    value: 15
                }]
            }
        },
        baseStats: {
            hp: 3800,
            atk: 240,
            def: 260,
            spd: 75,
            crt: 6,
            cdmg: 125,
            acc: 20,
            res: 25
        },
        growth: {
            hp: 240,
            atk: 15,
            def: 18,
            spd: 1
        }
    },

    // 光属性
    'chen_guang': {
        id: 'chen_guang',
        title: '破晓者',
        name: '晨光',
        rarity: Rarity.RARE,
        element: ElementType.LIGHT,
        art: {
            portrait: 'images/cards/chen_guang_portrait.bmp',
            fullbody: 'images/cards/chen_guang_full.bmp'
        },
        story: {
            summary: '在森林中引导迷路者的少女，据说是明烛的弟子',
            background: '她继承了明烛的灯笼，却还没有继承那份悲悯。她还在学习如何面对这个破碎的世界，如何在黑暗中保持希望。'
        },
        skills: {
            normal: {
                id: 'chen_guang_normal',
                name: '微光',
                description: '为生命最低的队友恢复攻击70%的生命',
                icon: 'skills/glimmer.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'heal' as any,
                    target: 'lowest_hp' as any,
                    value: 70
                }]
            },
            special: {
                id: 'chen_guang_special',
                name: '曙光',
                description: '为全体队友恢复攻击100%的生命，并清除所有减益效果',
                icon: 'skills/dawn_light_small.png',
                cost: 35,
                cooldown: 4,
                effects: [{
                    type: 'heal' as any,
                    target: 'all_allies' as any,
                    value: 100
                }, {
                    type: 'cleanse' as any,
                    target: 'all_allies' as any,
                    value: 1
                }]
            }
        },
        baseStats: {
            hp: 2500,
            atk: 260,
            def: 160,
            spd: 105,
            crt: 10,
            cdmg: 135,
            acc: 0,
            res: 18
        },
        growth: {
            hp: 155,
            atk: 19,
            def: 11,
            spd: 2
        }
    },

    // 暗属性
    'ye_ying': {
        id: 'ye_ying',
        name: '夜影',
        title: '森林的暗面',
        rarity: Rarity.RARE,
        element: ElementType.DARK,
        art: {
            portrait: 'images/cards/ye_ying_portrait.bmp',
            fullbody: 'images/cards/ye_ying_full.bmp'
        },
        story: {
            summary: '潜伏在森林阴影中的猎手，专门猎杀被记忆侵蚀的怪物',
            background: '他不说话，不与人交流，只会在你陷入危险时出现，解决掉威胁后又消失在黑暗中。没人知道他从哪里来，要到哪里去。'
        },
        skills: {
            normal: {
                id: 'ye_ying_normal',
                name: '暗影突袭',
                description: '对单个敌人造成攻击105%的伤害，无视目标20%防御',
                icon: 'skills/shadow_strike.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 105
                }]
            },
            special: {
                id: 'ye_ying_special',
                name: '暗影步',
                description: '进入隐身状态1回合（无法被选中），下回合必定暴击且伤害提升50%',
                icon: 'skills/shadow_step.png',
                cost: 25,
                cooldown: 3,
                effects: [{
                    type: 'buff_atk' as any,
                    target: 'self' as any,
                    value: 50,
                    duration: 1
                }]
            }
        },
        baseStats: {
            hp: 2400,
            atk: 330,
            def: 150,
            spd: 118,
            crt: 22,
            cdmg: 165,
            acc: 0,
            res: 12
        },
        growth: {
            hp: 150,
            atk: 23,
            def: 10,
            spd: 3
        }
    }
};

// 合并到主数据库的辅助函数
export function mergeExtendedCards(): void {
    const { CARD_DATABASE } = require('./CardDatabase');
    Object.assign(CARD_DATABASE, EXTENDED_CARD_DATABASE);
    console.log(`已加载扩展卡牌: ${Object.keys(EXTENDED_CARD_DATABASE).length} 张`);
}
