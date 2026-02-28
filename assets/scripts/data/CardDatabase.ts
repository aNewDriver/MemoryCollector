/**
 * 卡牌数据库
 * 所有可获得的卡牌配置
 */

import { CardData, ElementType, Rarity } from './CardData';

export const CARD_DATABASE: Record<string, CardData> = {
    // ==================== 火属性 ====================
    'jin_yu': {
        id: 'jin_yu',
        name: '烬羽',
        title: '最后的武士',
        rarity: Rarity.RARE,
        element: ElementType.FIRE,
        art: {
            portrait: 'cards/jin_yu_portrait.png',
            fullbody: 'cards/jin_yu_full.png',
            awakened: 'cards/jin_yu_awaken.png'
        },
        story: {
            summary: '守护村庄直到最后一刻的武士',
            background: '火焰吞噬了他的村庄，他独自站在村口，一人一刀，阻挡了数百怪物整整一夜。当援军赶到时，只看到他燃烧殆尽的铠甲，和依然紧握的刀。',
            memory1: '他记得师父说：刀在人在。',
            memory2: '他记得那个雨夜，村民们的哭喊。',
            memory3: '他不记得自己何时倒下的，只记得没有后退一步。'
        },
        skills: {
            normal: {
                id: 'jin_yu_normal',
                name: '炎斩',
                description: '对单个敌人造成攻击100%的伤害，有30%概率附加[燃烧]',
                icon: 'skills/fire_slash.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 100,
                    chance: 100
                }, {
                    type: 'burn' as any,
                    target: 'single_enemy' as any,
                    value: 20,
                    duration: 2,
                    chance: 30
                }]
            },
            special: {
                id: 'jin_yu_special',
                name: '红莲业火',
                description: '对前排敌人造成攻击150%的伤害，必定附加[燃烧]',
                icon: 'skills/red_lotus.png',
                cost: 30,
                cooldown: 3,
                effects: [{
                    type: 'damage' as any,
                    target: 'front_row' as any,
                    value: 150
                }, {
                    type: 'burn' as any,
                    target: 'front_row' as any,
                    value: 30,
                    duration: 3
                }]
            },
            passive: {
                id: 'jin_yu_passive',
                name: '燃魂',
                description: '生命低于30%时，暴击率提升50%',
                icon: 'skills/burning_soul.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'buff_atk' as any,
                    target: 'self' as any,
                    value: 50
                }]
            }
        },
        baseStats: {
            hp: 2800,
            atk: 320,
            def: 180,
            spd: 105,
            crt: 15,
            cdmg: 150,
            acc: 0,
            res: 10
        },
        growth: {
            hp: 180,
            atk: 22,
            def: 12,
            spd: 2
        }
    },

    'blacksmith_zhang': {
        id: 'blacksmith_zhang',
        name: '老张',
        title: '老铁匠',
        rarity: Rarity.COMMON,
        element: ElementType.FIRE,
        art: {
            portrait: 'cards/blacksmith_portrait.png',
            fullbody: 'cards/blacksmith_full.png'
        },
        story: {
            summary: '打了一辈子铁的老匠人',
            background: '他的铁匠铺是村里最热闹的地方。农具、厨具、还有给那些要出远门的年轻人打造的防身短刀。有人说他打的刀有灵性，他只是笑笑：铁要趁热，人要实心。'
        },
        skills: {
            normal: {
                id: 'bsz_normal',
                name: '重锤',
                description: '对单个敌人造成攻击90%的伤害',
                icon: 'skills/hammer.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 90
                }]
            },
            special: {
                id: 'bsz_special',
                name: '百炼成钢',
                description: '为全体队友增加防御力20%，持续2回合',
                icon: 'skills/temper.png',
                cost: 20,
                cooldown: 3,
                effects: [{
                    type: 'buff_def' as any,
                    target: 'all_allies' as any,
                    value: 20,
                    duration: 2
                }]
            }
        },
        baseStats: {
            hp: 3200,
            atk: 240,
            def: 220,
            spd: 85,
            crt: 5,
            cdmg: 120,
            acc: 0,
            res: 15
        },
        growth: {
            hp: 200,
            atk: 16,
            def: 15,
            spd: 1
        }
    },

    // ==================== 水属性 ====================
    'qing_yi': {
        id: 'qing_yi',
        name: '青漪',
        title: '抚琴者',
        rarity: Rarity.EPIC,
        element: ElementType.WATER,
        art: {
            portrait: 'cards/qing_yi_portrait.png',
            fullbody: 'cards/qing_yi_full.png',
            awakened: 'cards/qing_yi_awaken.png'
        },
        story: {
            summary: '用音乐治愈战乱创伤的艺人',
            background: '战乱年代，她背着琴走过无数村落。她的琴声能让哭泣的孩子安静，能让失眠的老兵入睡。有人说她弹的是魂曲，能把人的伤痛带走。',
            memory1: '她第一个学会的曲子，是母亲教的摇篮曲。',
            memory2: '她在废墟中为死者弹奏，为生者祈福。',
            memory3: '最后一曲，她弹给了自己。'
        },
        skills: {
            normal: {
                id: 'qy_normal',
                name: '清音',
                description: '为生命最低的队友恢复攻击80%的生命',
                icon: 'skills/clear_sound.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'heal' as any,
                    target: 'lowest_hp' as any,
                    value: 80
                }]
            },
            special: {
                id: 'qy_special',
                name: '流水回春',
                description: '为全体队友恢复攻击120%的生命，并净化所有减益效果',
                icon: 'skills/flowing_water.png',
                cost: 40,
                cooldown: 4,
                effects: [{
                    type: 'heal' as any,
                    target: 'all_allies' as any,
                    value: 120
                }, {
                    type: 'cleanse' as any,
                    target: 'all_allies' as any,
                    value: 1
                }]
            },
            passive: {
                id: 'qy_passive',
                name: '静心',
                description: '回合开始时，为生命最低的队友恢复攻击30%的生命',
                icon: 'skills/calm_mind.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'heal' as any,
                    target: 'lowest_hp' as any,
                    value: 30
                }]
            }
        },
        baseStats: {
            hp: 2400,
            atk: 280,
            def: 160,
            spd: 110,
            crt: 8,
            cdmg: 130,
            acc: 0,
            res: 20
        },
        growth: {
            hp: 150,
            atk: 20,
            def: 10,
            spd: 3
        }
    },

    // ==================== 风属性 ====================
    'zhu_feng': {
        id: 'zhu_feng',
        name: '逐风',
        title: '无影刺客',
        rarity: Rarity.EPIC,
        element: ElementType.WIND,
        art: {
            portrait: 'cards/zhu_feng_portrait.png',
            fullbody: 'cards/zhu_feng_full.png',
            awakened: 'cards/zhu_feng_awaken.png'
        },
        story: {
            summary: '游离于正义与灰色地带的杀手',
            background: '他接任务有三不杀：不杀好人，不杀孩子，不杀无辜。有人说他是义贼，有人说他是伪善。他自己也不知道，只知道风不会停留，他也是。'
        },
        skills: {
            normal: {
                id: 'zf_normal',
                name: '风刃',
                description: '对单个敌人造成攻击110%的伤害，自身速度越快伤害越高',
                icon: 'skills/wind_blade.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 110
                }]
            },
            special: {
                id: 'zf_special',
                name: '追风逐电',
                description: '对生命最低的敌人造成攻击200%的伤害，若击杀则再次行动',
                icon: 'skills/chase_wind.png',
                cost: 35,
                cooldown: 3,
                effects: [{
                    type: 'damage' as any,
                    target: 'lowest_hp' as any,
                    value: 200
                }]
            },
            passive: {
                id: 'zf_passive',
                name: '风之步',
                description: '对生命低于50%的敌人，伤害提升40%',
                icon: 'skills/wind_step.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'buff_atk' as any,
                    target: 'self' as any,
                    value: 40
                }]
            }
        },
        baseStats: {
            hp: 2200,
            atk: 360,
            def: 140,
            spd: 125,
            crt: 20,
            cdmg: 160,
            acc: 0,
            res: 10
        },
        growth: {
            hp: 140,
            atk: 26,
            def: 9,
            spd: 4
        }
    },

    // ==================== 土属性 ====================
    'yan_xin': {
        id: 'yan_xin',
        name: '岩心',
        title: '护城者',
        rarity: Rarity.RARE,
        element: ElementType.EARTH,
        art: {
            portrait: 'cards/yan_xin_portrait.png',
            fullbody: 'cards/yan_xin_full.png'
        },
        story: {
            summary: '以身躯阻挡怪潮的守城士兵',
            background: '他不是最强的战士，也不是最勇敢的。但当城门即将被攻破时，是他一个人站在那里，用盾牌和身体筑起了一道墙。'
        },
        skills: {
            normal: {
                id: 'yx_normal',
                name: '盾击',
                description: '对单个敌人造成攻击80%的伤害，有50%概率嘲讽目标',
                icon: 'skills/shield_bash.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 80
                }, {
                    type: 'taunt' as any,
                    target: 'single_enemy' as any,
                    value: 1,
                    duration: 1,
                    chance: 50
                }]
            },
            special: {
                id: 'yx_special',
                name: '不动如山',
                description: '获得护盾（防御300%），并嘲讽全体敌人2回合',
                icon: 'skills/immovable.png',
                cost: 30,
                cooldown: 4,
                effects: [{
                    type: 'shield' as any,
                    target: 'self' as any,
                    value: 300
                }, {
                    type: 'taunt' as any,
                    target: 'all_enemies' as any,
                    value: 1,
                    duration: 2
                }]
            }
        },
        baseStats: {
            hp: 4000,
            atk: 200,
            def: 280,
            spd: 80,
            crt: 5,
            cdmg: 120,
            acc: 20,
            res: 20
        },
        growth: {
            hp: 250,
            atk: 12,
            def: 20,
            spd: 1
        }
    },

    // ==================== 光属性 ====================
    'ming_zhu': {
        id: 'ming_zhu',
        name: '明烛',
        title: '持灯人',
        rarity: Rarity.LEGEND,
        element: ElementType.LIGHT,
        art: {
            portrait: 'cards/ming_zhu_portrait.png',
            fullbody: 'cards/ming_zhu_full.png',
            awakened: 'cards/ming_zhu_awaken.png'
        },
        story: {
            summary: '在黑暗中为人们点燃希望的女性',
            background: '她是最后一个持灯人。当世界陷入黑暗，她走遍废墟，为迷路的人照亮归途，为绝望的人点燃希望。她的灯永不熄灭，因为她的心里有光。',
            memory1: '她记得自己接过灯的那个夜晚。',
            memory2: '她记得每一个在灯光下重拾希望的面孔。',
            memory3: '她知道终有一天灯会熄灭，但光会传承。'
        },
        skills: {
            normal: {
                id: 'mz_normal',
                name: '烛照',
                description: '为全体队友恢复攻击60%的生命',
                icon: 'skills/candle_light.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'heal' as any,
                    target: 'all_allies' as any,
                    value: 60
                }]
            },
            special: {
                id: 'mz_special',
                name: '黎明之光',
                description: '复活一名阵亡队友（恢复50%生命），或为全体队友恢复攻击150%的生命',
                icon: 'skills/dawn_light.png',
                cost: 50,
                cooldown: 5,
                effects: [{
                    type: 'revive' as any,
                    target: 'single_ally' as any,
                    value: 50
                }, {
                    type: 'heal' as any,
                    target: 'all_allies' as any,
                    value: 150
                }]
            },
            passive: {
                id: 'mz_passive',
                name: '永燃',
                description: '队友受到致命伤害时，使其免疫此次伤害（每场战斗触发1次）',
                icon: 'skills/eternal_flame.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'shield' as any,
                    target: 'single_ally' as any,
                    value: 99999
                }]
            }
        },
        baseStats: {
            hp: 2600,
            atk: 300,
            def: 200,
            spd: 100,
            crt: 10,
            cdmg: 140,
            acc: 0,
            res: 30
        },
        growth: {
            hp: 160,
            atk: 22,
            def: 14,
            spd: 2
        }
    },

    // ==================== 暗属性（核心角色）====================
    'can_ying': {
        id: 'can_ying',
        name: '残影',
        title: '？？？',
        rarity: Rarity.MYTH,
        element: ElementType.DARK,
        art: {
            portrait: 'cards/can_ying_portrait.png',
            fullbody: 'cards/can_ying_full.png',
            awakened: 'cards/can_ying_awaken.png'
        },
        story: {
            summary: '你回收的第一块记忆碎片，却看不清面容',
            background: '这是你的第一块记忆碎片。奇怪的是，你看不清这个身影的面容。更奇怪的是，当你触碰它时，你感觉到了一种熟悉的温暖。',
            memory1: '[数据损坏]',
            memory2: '[权限不足]',
            memory3: '[需要觉醒后才能查看]'
        },
        skills: {
            normal: {
                id: 'cy_normal',
                name: '回响',
                description: '对单个敌人造成攻击120%的伤害，偷取1个增益效果',
                icon: 'skills/echo.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'damage' as any,
                    target: 'single_enemy' as any,
                    value: 120
                }, {
                    type: 'dispel' as any,
                    target: 'single_enemy' as any,
                    value: 1
                }]
            },
            special: {
                id: 'cy_special',
                name: '记忆洪流',
                description: '对全体敌人造成攻击180%的伤害，并复制最近释放的绝技',
                icon: 'skills/memory_flood.png',
                cost: 45,
                cooldown: 4,
                effects: [{
                    type: 'damage' as any,
                    target: 'all_enemies' as any,
                    value: 180
                }]
            },
            passive: {
                id: 'cy_passive',
                name: '未完成的记忆',
                description: '每回合有50%概率额外行动一次，随着亲密度提升概率增加',
                icon: 'skills/incomplete_memory.png',
                cost: 0,
                cooldown: 0,
                effects: [{
                    type: 'buff_spd' as any,
                    target: 'self' as any,
                    value: 100
                }]
            }
        },
        baseStats: {
            hp: 3000,
            atk: 350,
            def: 200,
            spd: 115,
            crt: 25,
            cdmg: 170,
            acc: 20,
            res: 25
        },
        growth: {
            hp: 190,
            atk: 25,
            def: 14,
            spd: 3
        }
    }
};

// 便捷获取函数
export function getCardData(cardId: string): CardData | undefined {
    return CARD_DATABASE[cardId];
}

export function getAllCards(): CardData[] {
    return Object.values(CARD_DATABASE);
}

export function getCardsByRarity(rarity: Rarity): CardData[] {
    return Object.values(CARD_DATABASE).filter(card => card.rarity === rarity);
}

export function getCardsByElement(element: ElementType): CardData[] {
    return Object.values(CARD_DATABASE).filter(card => card.element === element);
}
