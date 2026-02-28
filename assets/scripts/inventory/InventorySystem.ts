/**
 * 背包系统
 * 管理玩家的道具、材料、装备等
 */

export enum ItemType {
    MATERIAL = 'material',      // 养成材料
    EQUIPMENT = 'equipment',    // 装备
    CARD_FRAGMENT = 'card_fragment',  // 卡牌碎片
    CONSUMABLE = 'consumable',  // 消耗品
    GIFT = 'gift',              // 礼包
    CURRENCY = 'currency'       // 货币道具
}

export interface Item {
    id: string;                 // 唯一实例ID（装备有）或配置ID
    configId: string;           // 配置ID
    type: ItemType;
    count: number;              // 堆叠数量（装备类固定为1）
    
    // 装备特有属性
    equipmentData?: EquipmentData;
}

export interface EquipmentData {
    level: number;
    rarity: number;
    mainStat: EquipmentStat;
    subStats: EquipmentStat[];
    setId?: string;  // 套装ID
}

export interface EquipmentStat {
    type: StatType;
    value: number;
    isPercentage: boolean;
}

export enum StatType {
    HP = 'hp',
    ATK = 'atk',
    DEF = 'def',
    SPD = 'spd',
    CRT = 'crt',
    CDMG = 'cdmg',
    ACC = 'acc',
    RES = 'res'
}

export enum EquipmentSlot {
    WEAPON = 0,     // 武器
    HELMET = 1,     // 头盔
    ARMOR = 2,      // 护甲
    LEGS = 3,       // 护腿
    ACCESSORY = 4,  // 饰品
    RING = 5        // 戒指
}

export interface EquipmentConfig {
    id: string;
    name: string;
    slot: EquipmentSlot;
    rarity: number;
    baseStats: { [key in StatType]?: number };
    possibleSubStats: StatType[];
    setId?: string;
}

// 套装配置
export interface EquipmentSet {
    id: string;
    name: string;
    description: string;
    
    // 2件套效果
    bonus2: { stat: StatType; value: number };
    
    // 4件套效果
    bonus4: { stat: StatType; value: number };
}

// 背包系统
export class InventorySystem {
    private items: Map<string, Item> = new Map();  // key: instanceId or configId
    private equipmentConfigs: Map<string, EquipmentConfig> = new Map();
    private equipmentSets: Map<string, EquipmentSet> = new Map();
    
    constructor() {
        this.initEquipmentConfigs();
        this.initEquipmentSets();
    }
    
    private initEquipmentConfigs() {
        // 基础装备配置
        const configs: EquipmentConfig[] = [
            // 武器
            {
                id: 'sword_common',
                name: '铁剑',
                slot: EquipmentSlot.WEAPON,
                rarity: 1,
                baseStats: { [StatType.ATK]: 50 },
                possibleSubStats: [StatType.CRT, StatType.CDMG, StatType.SPD]
            },
            {
                id: 'sword_rare',
                name: '精钢剑',
                slot: EquipmentSlot.WEAPON,
                rarity: 2,
                baseStats: { [StatType.ATK]: 100 },
                possibleSubStats: [StatType.CRT, StatType.CDMG, StatType.SPD, StatType.HP]
            },
            // 头盔
            {
                id: 'helmet_common',
                name: '皮帽',
                slot: EquipmentSlot.HELMET,
                rarity: 1,
                baseStats: { [StatType.HP]: 200, [StatType.DEF]: 20 },
                possibleSubStats: [StatType.RES, StatType.HP, StatType.DEF]
            },
            // 护甲
            {
                id: 'armor_common',
                name: '皮甲',
                slot: EquipmentSlot.ARMOR,
                rarity: 1,
                baseStats: { [StatType.DEF]: 50 },
                possibleSubStats: [StatType.HP, StatType.DEF, StatType.RES]
            },
            // 护腿
            {
                id: 'legs_common',
                name: '皮裤',
                slot: EquipmentSlot.LEGS,
                rarity: 1,
                baseStats: { [StatType.HP]: 300 },
                possibleSubStats: [StatType.HP, StatType.DEF, StatType.SPD]
            },
            // 饰品
            {
                id: 'accessory_common',
                name: '铜项链',
                slot: EquipmentSlot.ACCESSORY,
                rarity: 1,
                baseStats: { [StatType.ACC]: 10 },
                possibleSubStats: [StatType.CRT, StatType.ACC, StatType.SPD]
            },
            // 戒指
            {
                id: 'ring_common',
                name: '铜戒指',
                slot: EquipmentSlot.RING,
                rarity: 1,
                baseStats: { [StatType.ATK]: 30 },
                possibleSubStats: [StatType.CRT, StatType.CDMG, StatType.ATK]
            }
        ];
        
        configs.forEach(config => {
            this.equipmentConfigs.set(config.id, config);
        });
    }
    
    private initEquipmentSets() {
        const sets: EquipmentSet[] = [
            {
                id: 'warrior_set',
                name: '战士套装',
                description: '远古战士的装备',
                bonus2: { stat: StatType.ATK, value: 15 },  // 2件套：攻击+15%
                bonus4: { stat: StatType.HP, value: 20 }     // 4件套：生命+20%
            },
            {
                id: 'guardian_set',
                name: '守护者套装',
                description: '守护者的坚韧铠甲',
                bonus2: { stat: StatType.DEF, value: 20 },
                bonus4: { stat: StatType.HP, value: 25 }
            },
            {
                id: 'speed_set',
                name: '疾风套装',
                description: '风一般的速度',
                bonus2: { stat: StatType.SPD, value: 10 },
                bonus4: { stat: StatType.SPD, value: 20 }
            },
            {
                id: 'crit_set',
                name: '暴击套装',
                description: '致命一击',
                bonus2: { stat: StatType.CRT, value: 12 },
                bonus4: { stat: StatType.CDMG, value: 30 }
            }
        ];
        
        sets.forEach(set => {
            this.equipmentSets.set(set.id, set);
        });
    }
    
    // ============ 物品管理 ============
    
    // 添加物品
    public addItem(configId: string, type: ItemType, count: number = 1, equipmentData?: EquipmentData): Item {
        // 如果是装备类，每件都有唯一ID
        if (type === ItemType.EQUIPMENT) {
            const instanceId = `${configId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const item: Item = {
                id: instanceId,
                configId,
                type,
                count: 1,
                equipmentData
            };
            this.items.set(instanceId, item);
            return item;
        }
        
        // 可堆叠物品
        const existingItem = this.getItemByConfigId(configId);
        if (existingItem) {
            existingItem.count += count;
            return existingItem;
        }
        
        const item: Item = {
            id: configId,
            configId,
            type,
            count
        };
        this.items.set(configId, item);
        return item;
    }
    
    // 移除物品
    public removeItem(itemId: string, count: number = 1): boolean {
        const item = this.items.get(itemId);
        if (!item) return false;
        
        if (item.count < count) return false;
        
        item.count -= count;
        if (item.count === 0) {
            this.items.delete(itemId);
        }
        return true;
    }
    
    // 消耗物品
    public consumeItem(configId: string, count: number): boolean {
        const item = this.getItemByConfigId(configId);
        if (!item || item.count < count) return false;
        
        return this.removeItem(item.id, count);
    }
    
    // 获取物品
    public getItem(itemId: string): Item | undefined {
        return this.items.get(itemId);
    }
    
    public getItemByConfigId(configId: string): Item | undefined {
        return Array.from(this.items.values()).find(item => item.configId === configId);
    }
    
    // 获取物品数量
    public getItemCount(configId: string): number {
        const item = this.getItemByConfigId(configId);
        return item?.count || 0;
    }
    
    // 按类型获取物品
    public getItemsByType(type: ItemType): Item[] {
        return Array.from(this.items.values()).filter(item => item.type === type);
    }
    
    // ============ 装备生成 ============
    
    // 生成随机装备
    public generateEquipment(configId: string, rarity: number = 1): Item {
        const config = this.equipmentConfigs.get(configId);
        if (!config) throw new Error(`装备配置不存在: ${configId}`);
        
        // 计算主属性数值（随稀有度提升）
        const mainStatValue = Object.values(config.baseStats)[0] * (1 + (rarity - 1) * 0.2);
        
        const equipmentData: EquipmentData = {
            level: 1,
            rarity,
            mainStat: {
                type: Object.keys(config.baseStats)[0] as StatType,
                value: Math.floor(mainStatValue),
                isPercentage: false
            },
            subStats: this.generateSubStats(config, rarity),
            setId: config.setId
        };
        
        return this.addItem(configId, ItemType.EQUIPMENT, 1, equipmentData);
    }
    
    private generateSubStats(config: EquipmentConfig, rarity: number): EquipmentStat[] {
        const stats: EquipmentStat[] = [];
        const statCount = rarity + 1;  // 稀有度决定副属性数量
        
        const possibleStats = [...config.possibleSubStats];
        
        for (let i = 0; i < Math.min(statCount, possibleStats.length); i++) {
            const statIndex = Math.floor(Math.random() * possibleStats.length);
            const statType = possibleStats.splice(statIndex, 1)[0];
            
            const value = this.generateSubStatValue(statType, rarity);
            stats.push({
                type: statType,
                value,
                isPercentage: [StatType.CRT, StatType.CDMG, StatType.ACC, StatType.RES].includes(statType)
            });
        }
        
        return stats;
    }
    
    private generateSubStatValue(type: StatType, rarity: number): number {
        const baseValues: { [key in StatType]?: number } = {
            [StatType.HP]: 50,
            [StatType.ATK]: 10,
            [StatType.DEF]: 8,
            [StatType.SPD]: 3,
            [StatType.CRT]: 3,
            [StatType.CDMG]: 5,
            [StatType.ACC]: 4,
            [StatType.RES]: 4
        };
        
        const base = baseValues[type] || 10;
        const multiplier = 1 + (rarity - 1) * 0.3;
        const variation = 0.8 + Math.random() * 0.4;  // ±20%浮动
        
        return Math.floor(base * multiplier * variation);
    }
    
    // ============ 装备强化 ============
    
    // 强化装备
    public upgradeEquipment(itemId: string, goldCost: number): {
        success: boolean;
        error?: string;
    } {
        const item = this.items.get(itemId);
        if (!item || item.type !== ItemType.EQUIPMENT) {
            return { success: false, error: '装备不存在' };
        }
        
        const data = item.equipmentData!;
        const maxLevel = data.rarity * 10;  // 稀有度*10=等级上限
        
        if (data.level >= maxLevel) {
            return { success: false, error: '已达等级上限' };
        }
        
        data.level++;
        
        // 提升主属性
        data.mainStat.value = Math.floor(data.mainStat.value * 1.05);
        
        // 每5级提升一次副属性
        if (data.level % 5 === 0) {
            this.enhanceSubStat(data);
        }
        
        return { success: true };
    }
    
    private enhanceSubStat(data: EquipmentData) {
        // 随机选择一个副属性提升
        const stat = data.subStats[Math.floor(Math.random() * data.subStats.length)];
        const increase = stat.isPercentage ? 1 : Math.floor(stat.value * 0.1);
        stat.value += increase;
    }
    
    // ============ 套装效果 ============
    
    // 计算套装效果
    public calculateSetBonus(equipmentIds: string[]): { [setId: string]: number } {
        const setCounts: { [setId: string]: number } = {};
        
        equipmentIds.forEach(id => {
            const item = this.items.get(id);
            if (item?.equipmentData?.setId) {
                setCounts[item.equipmentData.setId] = (setCounts[item.equipmentData.setId] || 0) + 1;
            }
        });
        
        return setCounts;
    }
    
    public getSetConfig(setId: string): EquipmentSet | undefined {
        return this.equipmentSets.get(setId);
    }
    
    // ============ 卡牌碎片合成 ============
    
    // 合成卡牌
    public canComposeCard(cardId: string): { canCompose: boolean; hasCount: number; needCount: number } {
        const fragmentId = `frag_${cardId}`;
        const hasCount = this.getItemCount(fragmentId);
        const needCount = 30;  // 默认30碎片合成一张卡
        
        return {
            canCompose: hasCount >= needCount,
            hasCount,
            needCount
        };
    }
    
    public composeCard(cardId: string): boolean {
        const { canCompose } = this.canComposeCard(cardId);
        if (!canCompose) return false;
        
        const fragmentId = `frag_${cardId}`;
        this.consumeItem(fragmentId, 30);
        
        // TODO: 发放完整卡牌
        return true;
    }
    
    // ============ 背包容量 ============
    
    private maxSlot = 200;
    
    public getUsedSlots(): number {
        let count = 0;
        this.items.forEach(item => {
            if (item.type === ItemType.EQUIPMENT) {
                count += item.count;  // 装备每件占一个格子
            } else {
                count += Math.ceil(item.count / 99);  // 其他物品每99个占一个格子
            }
        });
        return count;
    }
    
    public getMaxSlots(): number {
        return this.maxSlot;
    }
    
    public isFull(): boolean {
        return this.getUsedSlots() >= this.maxSlot;
    }
}

// 单例
export const inventorySystem = new InventorySystem();
