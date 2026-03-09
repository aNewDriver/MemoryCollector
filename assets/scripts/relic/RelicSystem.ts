/**
 * 遗物系统
 * 参考：杀戮尖塔的遗物机制
 * 核心玩法：永久被动能力，提供各种战斗/探索加成
 */

import { ElementType } from '../data/CardData';

export enum RelicRarity {
    COMMON = 'common',      // 普通 - 白色
    UNCOMMON = 'uncommon',  // 罕见 - 蓝色  
    RARE = 'rare',          // 稀有 - 金色
    BOSS = 'boss',          // Boss - 红色
    EVENT = 'event'         // 事件 - 特殊
}

export enum RelicType {
    COMBAT = 'combat',      // 战斗相关
    EXPLORATION = 'exploration', // 探索相关
    ECONOMY = 'economy',    // 经济/资源
    DEFENSE = 'defense',    // 防御/生存
    OFFENSE = 'offense',    // 攻击/输出
    SPECIAL = 'special'     // 特殊效果
}

export interface RelicData {
    id: string;
    name: string;
    description: string;
    flavorText?: string;     // 风味文本
    rarity: RelicRarity;
    type: RelicType;
    icon: string;
    
    // 效果配置
    effects: RelicEffect[];
    
    // 是否可叠加
    stackable: boolean;
    maxStack?: number;
    
    // 解锁条件
    unlockCondition?: {
        type: 'chapter' | 'achievement' | 'event';
        value: string;
    };
}

export interface RelicEffect {
    trigger: RelicTrigger;
    condition?: RelicCondition;
    action: RelicAction;
    value: number;
    description: string;
}

export enum RelicTrigger {
    ON_BATTLE_START = 'on_battle_start',     // 战斗开始时
    ON_BATTLE_END = 'on_battle_end',         // 战斗结束时
    ON_TURN_START = 'on_turn_start',         // 回合开始时
    ON_TURN_END = 'on_turn_end',             // 回合结束时
    ON_CARD_PLAY = 'on_card_play',           // 打出卡牌时
    ON_DAMAGE_DEALT = 'on_damage_dealt',     // 造成伤害时
    ON_DAMAGE_TAKEN = 'on_damage_taken',     // 受到伤害时
    ON_HEAL = 'on_heal',                     // 治疗时
    ON_KILL = 'on_kill',                     // 击杀敌人时
    ON_DRAW = 'on_draw',                     // 抽牌时
    ON_ENERGY_GAIN = 'on_energy_gain',       // 获得能量时
    ON_ENTER_ROOM = 'on_enter_room',         // 进入房间时
    ON_SHOP_ENTER = 'on_shop_enter',         // 进入商店时
    ON_CAMPFIRE = 'on_campfire',             // 在休息处时
    PERMANENT = 'permanent'                  // 永久生效
}

export interface RelicCondition {
    type: 'element' | 'rarity' | 'health_below' | 'health_above' | 'has_buff' | 'has_debuff';
    value: any;
}

export interface RelicAction {
    type: 'add_damage' | 'reduce_damage' | 'heal' | 'draw_card' | 'add_energy' | 'add_buff' | 'add_gold' | 'modify_stat';
    target: 'self' | 'enemy' | 'all_enemies' | 'random_enemy';
}

// 遗物实例
export interface RelicInstance {
    instanceId: string;
    relicId: string;
    stackCount: number;
    acquiredAt: number;     // 获得时间戳
    acquiredFloor: number;  // 获得时的层数
}

/**
 * 遗物数据库
 */
export const RELIC_DATABASE: RelicData[] = [
    // ========== 普通遗物 ==========
    {
        id: 'relic_vigor_pendant',
        name: '活力吊坠',
        description: '战斗开始时，获得5点护盾',
        flavorText: '佩戴者能感受到源源不断的生命力流淌',
        rarity: RelicRarity.COMMON,
        type: RelicType.DEFENSE,
        icon: 'relics/vigor_pendant.png',
        effects: [{
            trigger: RelicTrigger.ON_BATTLE_START,
            action: { type: 'add_buff', target: 'self' },
            value: 5,
            description: '获得5点护盾'
        }],
        stackable: false
    },
    {
        id: 'relic_sharp_blade',
        name: '锋利刀片',
        description: '造成的伤害+1',
        flavorText: '边缘锋利到可以切割空气',
        rarity: RelicRarity.COMMON,
        type: RelicType.OFFENSE,
        icon: 'relics/sharp_blade.png',
        effects: [{
            trigger: RelicTrigger.PERMANENT,
            action: { type: 'modify_stat', target: 'self' },
            value: 1,
            description: '伤害+1'
        }],
        stackable: true,
        maxStack: 5
    },
    {
        id: 'relic_gold_pouch',
        name: '金币袋',
        description: '战斗胜利时，额外获得10金币',
        flavorText: '沉甸甸的，里面似乎永远有钱币的声响',
        rarity: RelicRarity.COMMON,
        type: RelicType.ECONOMY,
        icon: 'relics/gold_pouch.png',
        effects: [{
            trigger: RelicTrigger.ON_BATTLE_END,
            action: { type: 'add_gold', target: 'self' },
            value: 10,
            description: '额外10金币'
        }],
        stackable: true,
        maxStack: 3
    },
    {
        id: 'relic_energy_shard',
        name: '能量碎片',
        description: '回合开始时，有25%几率额外获得1点能量',
        flavorText: '蕴含着不稳定的魔法能量',
        rarity: RelicRarity.COMMON,
        type: RelicType.COMBAT,
        icon: 'relics/energy_shard.png',
        effects: [{
            trigger: RelicTrigger.ON_TURN_START,
            condition: { type: 'health_above', value: 0 },
            action: { type: 'add_energy', target: 'self' },
            value: 1,
            description: '25%几率+1能量'
        }],
        stackable: true,
        maxStack: 4
    },
    {
        id: 'relic_healing_herb',
        name: '治愈草药',
        description: '战斗结束时，恢复3点生命',
        flavorText: '散发着令人安心的清香',
        rarity: RelicRarity.COMMON,
        type: RelicType.DEFENSE,
        icon: 'relics/healing_herb.png',
        effects: [{
            trigger: RelicTrigger.ON_BATTLE_END,
            action: { type: 'heal', target: 'self' },
            value: 3,
            description: '恢复3生命'
        }],
        stackable: true,
        maxStack: 5
    },
    
    // ========== 罕见遗物 ==========
    {
        id: 'relic_element_ring',
        name: '元素之戒',
        description: '打出与上张相同元素的卡牌时，伤害+3',
        flavorText: '戒指上镶嵌着不断变换颜色的宝石',
        rarity: RelicRarity.UNCOMMON,
        type: RelicType.OFFENSE,
        icon: 'relics/element_ring.png',
        effects: [{
            trigger: RelicTrigger.ON_CARD_PLAY,
            action: { type: 'add_damage', target: 'enemy' },
            value: 3,
            description: '同元素连击+3伤害'
        }],
        stackable: false
    },
    {
        id: 'relic_thorn_armor',
        name: '荆棘护甲',
        description: '受到攻击时，反弹2点伤害',
        flavorText: '触摸时会被刺痛，但保护效果出色',
        rarity: RelicRarity.UNCOMMON,
        type: RelicType.DEFENSE,
        icon: 'relics/thorn_armor.png',
        effects: [{
            trigger: RelicTrigger.ON_DAMAGE_TAKEN,
            action: { type: 'add_damage', target: 'random_enemy' },
            value: 2,
            description: '反弹2伤害'
        }],
        stackable: true,
        maxStack: 3
    },
    {
        id: 'relic_card_compass',
        name: '卡牌罗盘',
        description: '每场战斗第一次洗牌后，抽2张牌',
        flavorText: '指向胜利的方向',
        rarity: RelicRarity.UNCOMMON,
        type: RelicType.COMBAT,
        icon: 'relics/card_compass.png',
        effects: [{
            trigger: RelicTrigger.ON_DRAW,
            action: { type: 'draw_card', target: 'self' },
            value: 2,
            description: '洗牌后抽2牌'
        }],
        stackable: false
    },
    {
        id: 'relic_merchant_favor',
        name: '商人好感',
        description: '商店商品价格降低20%',
        flavorText: '商人们似乎对你格外友善',
        rarity: RelicRarity.UNCOMMON,
        type: RelicType.ECONOMY,
        icon: 'relics/merchant_favor.png',
        effects: [{
            trigger: RelicTrigger.ON_SHOP_ENTER,
            action: { type: 'modify_stat', target: 'self' },
            value: 0.8,
            description: '商店-20%价格'
        }],
        stackable: true,
        maxStack: 2
    },
    {
        id: 'relic_map_scroll',
        name: '地图卷轴',
        description: '进入新房间时，有30%几率揭示相邻房间的类型',
        flavorText: '古老的手绘地图，标注着神秘的符号',
        rarity: RelicRarity.UNCOMMON,
        type: RelicType.EXPLORATION,
        icon: 'relics/map_scroll.png',
        effects: [{
            trigger: RelicTrigger.ON_ENTER_ROOM,
            action: { type: 'modify_stat', target: 'self' },
            value: 0.3,
            description: '30%揭示相邻房间'
        }],
        stackable: false
    },
    
    // ========== 稀有遗物 ==========
    {
        id: 'relic_dragon_heart',
        name: '龙之心脏',
        description: '生命值低于25%时，造成的伤害+50%',
        flavorText: '传说中巨龙的心脏碎片，蕴含着毁灭性的力量',
        rarity: RelicRarity.RARE,
        type: RelicType.OFFENSE,
        icon: 'relics/dragon_heart.png',
        effects: [{
            trigger: RelicTrigger.ON_DAMAGE_DEALT,
            condition: { type: 'health_below', value: 0.25 },
            action: { type: 'add_damage', target: 'enemy' },
            value: 0.5,
            description: '低血量+50%伤害'
        }],
        stackable: false
    },
    {
        id: 'relic_phoenix_feather',
        name: '凤凰之羽',
        description: '每场战斗1次，受到致命伤害时保留1点生命并恢复20生命',
        flavorText: '在火焰中重生的象征',
        rarity: RelicRarity.RARE,
        type: RelicType.DEFENSE,
        icon: 'relics/phoenix_feather.png',
        effects: [{
            trigger: RelicTrigger.ON_DAMAGE_TAKEN,
            action: { type: 'heal', target: 'self' },
            value: 20,
            description: '免死并恢复20生命'
        }],
        stackable: true,
        maxStack: 2
    },
    {
        id: 'relic_time_hourglass',
        name: '时光沙漏',
        description: '每场战斗开始时，额外抽3张牌',
        flavorText: '时间在其中流动得与众不同',
        rarity: RelicRarity.RARE,
        type: RelicType.COMBAT,
        icon: 'relics/time_hourglass.png',
        effects: [{
            trigger: RelicTrigger.ON_BATTLE_START,
            action: { type: 'draw_card', target: 'self' },
            value: 3,
            description: '额外抽3牌'
        }],
        stackable: true,
        maxStack: 2
    },
    {
        id: 'relic_kings_crown',
        name: '王者之冠',
        description: '所有卡牌费用-1（最低为1）',
        flavorText: '曾经属于一位伟大君主的象征',
        rarity: RelicRarity.RARE,
        type: RelicType.SPECIAL,
        icon: 'relics/kings_crown.png',
        effects: [{
            trigger: RelicTrigger.PERMANENT,
            action: { type: 'modify_stat', target: 'self' },
            value: -1,
            description: '卡牌费用-1'
        }],
        stackable: false
    },
    {
        id: 'relic_lucky_coin',
        name: '幸运硬币',
        description: '抽牌时有15%几率额外抽1张',
        flavorText: '抛向空中时，它总会以你希望的那一面落地',
        rarity: RelicRarity.RARE,
        type: RelicType.SPECIAL,
        icon: 'relics/lucky_coin.png',
        effects: [{
            trigger: RelicTrigger.ON_DRAW,
            action: { type: 'draw_card', target: 'self' },
            value: 1,
            description: '15%额外抽牌'
        }],
        stackable: true,
        maxStack: 3
    },
    
    // ========== Boss遗物 ==========
    {
        id: 'relic_boss_collector_core',
        name: '收集者核心',
        description: '击败敌人时，有30%几率获得一张该敌人主题的卡牌',
        flavorText: '记忆回收者的核心组件，能够捕捉敌人的记忆碎片',
        rarity: RelicRarity.BOSS,
        type: RelicType.SPECIAL,
        icon: 'relics/boss/collector_core.png',
        effects: [{
            trigger: RelicTrigger.ON_KILL,
            action: { type: 'draw_card', target: 'self' },
            value: 1,
            description: '30%获得敌人卡牌'
        }],
        unlockCondition: { type: 'chapter', value: '1' }
    },
    {
        id: 'relic_boss_memory_crystal',
        name: '记忆水晶',
        description: '最大生命值+20，每场战斗开始获得2点能量',
        flavorText: '储存着无数记忆的神秘水晶',
        rarity: RelicRarity.BOSS,
        type: RelicType.SPECIAL,
        icon: 'relics/boss/memory_crystal.png',
        effects: [
            {
                trigger: RelicTrigger.PERMANENT,
                action: { type: 'modify_stat', target: 'self' },
                value: 20,
                description: '最大生命+20'
            },
            {
                trigger: RelicTrigger.ON_BATTLE_START,
                action: { type: 'add_energy', target: 'self' },
                value: 2,
                description: '+2能量'
            }
        ],
        unlockCondition: { type: 'chapter', value: '2' }
    },
    {
        id: 'relic_boss_void_mirror',
        name: '虚空之镜',
        description: '复制你打出的第一张卡牌',
        flavorText: '镜面中映出的动作会被重复',
        rarity: RelicRarity.BOSS,
        type: RelicType.SPECIAL,
        icon: 'relics/boss/void_mirror.png',
        effects: [{
            trigger: RelicTrigger.ON_CARD_PLAY,
            action: { type: 'modify_stat', target: 'self' },
            value: 1,
            description: '复制首牌'
        }],
        unlockCondition: { type: 'chapter', value: '3' }
    }
];

/**
 * 遗物管理器
 */
export class RelicManager {
    private ownedRelics: Map<string, RelicInstance> = new Map();
    private relicEffects: Map<RelicTrigger, RelicEffect[]> = new Map();

    /**
     * 获取遗物数据
     */
    getRelicData(relicId: string): RelicData | undefined {
        return RELIC_DATABASE.find(r => r.id === relicId);
    }

    /**
     * 获得遗物
     */
    acquireRelic(relicId: string, floor: number): boolean {
        const data = this.getRelicData(relicId);
        if (!data) return false;

        const existing = this.ownedRelics.get(relicId);
        
        if (existing) {
            // 检查是否可叠加
            if (!data.stackable) return false;
            if (data.maxStack && existing.stackCount >= data.maxStack) return false;
            
            existing.stackCount++;
        } else {
            const instance: RelicInstance = {
                instanceId: `relic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                relicId,
                stackCount: 1,
                acquiredAt: Date.now(),
                acquiredFloor: floor
            };
            this.ownedRelics.set(relicId, instance);
        }

        this.updateEffectCache();
        return true;
    }

    /**
     * 失去遗物
     */
    loseRelic(relicId: string): boolean {
        const existing = this.ownedRelics.get(relicId);
        if (!existing) return false;

        if (existing.stackCount > 1) {
            existing.stackCount--;
        } else {
            this.ownedRelics.delete(relicId);
        }

        this.updateEffectCache();
        return true;
    }

    /**
     * 获取所有遗物
     */
    getAllRelics(): RelicInstance[] {
        return Array.from(this.ownedRelics.values());
    }

    /**
     * 获取特定类型的遗物
     */
    getRelicsByType(type: RelicType): RelicInstance[] {
        return this.getAllRelics().filter(instance => {
            const data = this.getRelicData(instance.relicId);
            return data?.type === type;
        });
    }

    /**
     * 获取特定稀有度的遗物
     */
    getRelicsByRarity(rarity: RelicRarity): RelicInstance[] {
        return this.getAllRelics().filter(instance => {
            const data = this.getRelicData(instance.relicId);
            return data?.rarity === rarity;
        });
    }

    /**
     * 触发遗物效果
     */
    triggerEffect(trigger: RelicTrigger, context: any): any[] {
        const effects = this.relicEffects.get(trigger) || [];
        const results: any[] = [];

        for (const effect of effects) {
            // 检查条件
            if (effect.condition && !this.checkCondition(effect.condition, context)) {
                continue;
            }

            // 执行效果
            const result = this.executeEffect(effect, context);
            results.push(result);
        }

        return results;
    }

    /**
     * 检查条件
     */
    private checkCondition(condition: RelicCondition, context: any): boolean {
        switch (condition.type) {
            case 'health_below':
                return (context.currentHealth / context.maxHealth) < condition.value;
            case 'health_above':
                return (context.currentHealth / context.maxHealth) > condition.value;
            case 'element':
                return context.element === condition.value;
            case 'rarity':
                return context.rarity === condition.value;
            default:
                return true;
        }
    }

    /**
     * 执行效果
     */
    private executeEffect(effect: RelicEffect, context: any): any {
        return {
            type: effect.action.type,
            target: effect.action.target,
            value: effect.value * (context.stackCount || 1)
        };
    }

    /**
     * 更新效果缓存
     */
    private updateEffectCache(): void {
        this.relicEffects.clear();

        for (const instance of this.ownedRelics.values()) {
            const data = this.getRelicData(instance.relicId);
            if (!data) continue;

            for (const effect of data.effects) {
                if (!this.relicEffects.has(effect.trigger)) {
                    this.relicEffects.set(effect.trigger, []);
                }
                this.relicEffects.get(effect.trigger)!.push(effect);
            }
        }
    }

    /**
     * 清除所有遗物
     */
    clear(): void {
        this.ownedRelics.clear();
        this.relicEffects.clear();
    }

    /**
     * 导出存档数据
     */
    exportSaveData(): RelicInstance[] {
        return this.getAllRelics();
    }

    /**
     * 导入存档数据
     */
    importSaveData(data: RelicInstance[]): void {
        this.ownedRelics.clear();
        for (const instance of data) {
            this.ownedRelics.set(instance.relicId, instance);
        }
        this.updateEffectCache();
    }
}

// 导出单例
export const relicManager = new RelicManager();
export { RELIC_DATABASE };
