/**
 * 商店系统
 * 游戏内商店
 */

export enum ShopCategory {
    RECOMMENDED = 'recommended',  // 推荐/礼包
    CARDS = 'cards',              // 卡牌碎片
    EQUIPMENT = 'equipment',      // 装备
    MATERIALS = 'materials',      // 养成材料
    CURRENCY = 'currency'         // 货币兑换
}

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    category: ShopCategory;
    
    // 商品内容
    itemType: 'card_fragment' | 'equipment' | 'material' | 'currency' | 'pack';
    itemId: string;
    count: number;
    
    // 价格
    price: {
        currency: string;
        amount: number;
    };
    
    // 限购
    limitType?: 'daily' | 'weekly' | 'monthly' | 'permanent';
    limitCount?: number;
    
    // 折扣
    discount?: number;  // 0-1，如0.8表示8折
    originalPrice?: number;
    
    // 显示标签
    tags?: string[];  // 'hot', 'new', 'limited' 等
    
    // 解锁条件
    requiredLevel?: number;
    requiredChapter?: number;
}

export interface ShopRefreshConfig {
    category: ShopCategory;
    refreshInterval: number;  // 刷新间隔（秒）
    refreshCost: { currency: string; amount: number };  // 手动刷新价格
    itemCount: number;  // 每次刷新显示的商品数量
}

// 商店数据
export class ShopSystem {
    private items: Map<ShopCategory, ShopItem[]> = new Map();
    private refreshConfigs: Map<ShopCategory, ShopRefreshConfig> = new Map();
    private lastRefreshTime: Map<ShopCategory, number> = new Map();
    private purchaseCount: Map<string, number> = new Map();  // 记录限购次数
    
    constructor() {
        this.initShopItems();
        this.initRefreshConfigs();
    }
    
    private initShopItems() {
        // 推荐/礼包
        const recommendedItems: ShopItem[] = [
            {
                id: 'starter_pack',
                name: '新手礼包',
                description: '包含初始冒险所需的各种资源',
                category: ShopCategory.RECOMMENDED,
                itemType: 'pack',
                itemId: 'starter_pack_contents',
                count: 1,
                price: { currency: 'soul_crystal', amount: 600 },
                limitType: 'permanent',
                limitCount: 1,
                discount: 0.3,
                originalPrice: 2000,
                tags: ['hot', 'limited']
            },
            {
                id: 'weekly_pack',
                name: '周常资源包',
                description: '大量金币和记忆粉尘',
                category: ShopCategory.RECOMMENDED,
                itemType: 'pack',
                itemId: 'weekly_pack_contents',
                count: 1,
                price: { currency: 'soul_crystal', amount: 980 },
                limitType: 'weekly',
                limitCount: 3,
                tags: ['hot']
            },
            {
                id: 'gacha_pack',
                name: '召唤礼包',
                description: '包含10张召唤券',
                category: ShopCategory.RECOMMENDED,
                itemType: 'currency',
                itemId: 'gacha_ticket',
                count: 10,
                price: { currency: 'soul_crystal', amount: 2700 },
                limitType: 'monthly',
                limitCount: 5,
                discount: 0.9,
                tags: ['hot']
            }
        ];
        
        // 卡牌碎片
        const cardItems: ShopItem[] = [
            {
                id: 'frag_jin_yu',
                name: '烬羽碎片',
                description: '收集30个碎片可合成完整卡牌',
                category: ShopCategory.CARDS,
                itemType: 'card_fragment',
                itemId: 'jin_yu',
                count: 5,
                price: { currency: 'tower_token', amount: 100 },
                limitType: 'weekly',
                limitCount: 2
            },
            {
                id: 'frag_yan_xin',
                name: '岩心碎片',
                description: '收集30个碎片可合成完整卡牌',
                category: ShopCategory.CARDS,
                itemType: 'card_fragment',
                itemId: 'yan_xin',
                count: 5,
                price: { currency: 'tower_token', amount: 100 },
                limitType: 'weekly',
                limitCount: 2
            },
            {
                id: 'frag_qing_yi',
                name: '青漪碎片',
                description: '收集50个碎片可合成完整卡牌',
                category: ShopCategory.CARDS,
                itemType: 'card_fragment',
                itemId: 'qing_yi',
                count: 5,
                price: { currency: 'tower_token', amount: 200 },
                limitType: 'weekly',
                limitCount: 1
            }
        ];
        
        // 装备
        const equipmentItems: ShopItem[] = [
            {
                id: 'eq_weapon_common',
                name: '普通武器箱',
                description: '随机获得1件普通品质武器',
                category: ShopCategory.EQUIPMENT,
                itemType: 'equipment',
                itemId: 'random_weapon_common',
                count: 1,
                price: { currency: 'gold', amount: 5000 }
            },
            {
                id: 'eq_armor_rare',
                name: '稀有护甲箱',
                description: '随机获得1件稀有品质护甲',
                category: ShopCategory.EQUIPMENT,
                itemType: 'equipment',
                itemId: 'random_armor_rare',
                count: 1,
                price: { currency: 'gold', amount: 20000 },
                limitType: 'daily',
                limitCount: 3
            }
        ];
        
        // 养成材料
        const materialItems: ShopItem[] = [
            {
                id: 'mat_exp_small',
                name: '记忆粉尘（小）',
                description: '提供1000点卡牌经验',
                category: ShopCategory.MATERIALS,
                itemType: 'material',
                itemId: 'memory_dust_small',
                count: 10,
                price: { currency: 'gold', amount: 500 },
                limitType: 'daily',
                limitCount: 20
            },
            {
                id: 'mat_exp_large',
                name: '记忆粉尘（大）',
                description: '提供10000点卡牌经验',
                category: ShopCategory.MATERIALS,
                itemType: 'material',
                itemId: 'memory_dust_large',
                count: 5,
                price: { currency: 'gold', amount: 4500 },
                limitType: 'daily',
                limitCount: 10
            },
            {
                id: 'mat_ascension',
                name: '突破石',
                description: '用于卡牌突破',
                category: ShopCategory.MATERIALS,
                itemType: 'material',
                itemId: 'ascension_stone',
                count: 10,
                price: { currency: 'gold', amount: 10000 },
                limitType: 'daily',
                limitCount: 5
            },
            {
                id: 'mat_skill_basic',
                name: '基础技能书',
                description: '用于技能升级（1-2级）',
                category: ShopCategory.MATERIALS,
                itemType: 'material',
                itemId: 'skill_book_basic',
                count: 5,
                price: { currency: 'gold', amount: 2000 },
                limitType: 'weekly',
                limitCount: 10
            },
            {
                id: 'mat_skill_advanced',
                name: '高级技能书',
                description: '用于技能升级（3-5级）',
                category: ShopCategory.MATERIALS,
                itemType: 'material',
                itemId: 'skill_book_advanced',
                count: 2,
                price: { currency: 'soul_crystal', amount: 100 },
                limitType: 'weekly',
                limitCount: 5
            }
        ];
        
        // 货币兑换
        const currencyItems: ShopItem[] = [
            {
                id: 'cur_gold',
                name: '金币包',
                description: '10000金币',
                category: ShopCategory.CURRENCY,
                itemType: 'currency',
                itemId: 'gold',
                count: 10000,
                price: { currency: 'soul_crystal', amount: 100 },
                limitType: 'daily',
                limitCount: 10
            },
            {
                id: 'cur_stamina',
                name: '体力恢复',
                description: '恢复60点体力',
                category: ShopCategory.CURRENCY,
                itemType: 'currency',
                itemId: 'stamina',
                count: 60,
                price: { currency: 'soul_crystal', amount: 50 },
                limitType: 'daily',
                limitCount: 5
            }
        ];
        
        this.items.set(ShopCategory.RECOMMENDED, recommendedItems);
        this.items.set(ShopCategory.CARDS, cardItems);
        this.items.set(ShopCategory.EQUIPMENT, equipmentItems);
        this.items.set(ShopCategory.MATERIALS, materialItems);
        this.items.set(ShopCategory.CURRENCY, currencyItems);
    }
    
    private initRefreshConfigs() {
        // 普通商品每日刷新
        this.refreshConfigs.set(ShopCategory.EQUIPMENT, {
            category: ShopCategory.EQUIPMENT,
            refreshInterval: 24 * 60 * 60,  // 24小时
            refreshCost: { currency: 'soul_crystal', amount: 50 },
            itemCount: 6
        });
        
        this.refreshConfigs.set(ShopCategory.MATERIALS, {
            category: ShopCategory.MATERIALS,
            refreshInterval: 24 * 60 * 60,
            refreshCost: { currency: 'soul_crystal', amount: 50 },
            itemCount: 8
        });
    }
    
    // 获取商品列表
    public getItems(category: ShopCategory, playerLevel: number, playerChapter: number): ShopItem[] {
        const items = this.items.get(category) || [];
        
        return items.filter(item => {
            // 检查解锁条件
            if (item.requiredLevel && playerLevel < item.requiredLevel) return false;
            if (item.requiredChapter && playerChapter < item.requiredChapter) return false;
            
            // 检查是否已售罄
            const purchasedCount = this.purchaseCount.get(item.id) || 0;
            if (item.limitCount && purchasedCount >= item.limitCount) return false;
            
            return true;
        });
    }
    
    // 购买商品
    public purchase(itemId: string, playerCurrency: { [key: string]: number }): { 
        success: boolean; 
        error?: string;
        item?: ShopItem;
    } {
        // 查找商品
        let item: ShopItem | undefined;
        for (const [, items] of this.items) {
            item = items.find(i => i.id === itemId);
            if (item) break;
        }
        
        if (!item) {
            return { success: false, error: '商品不存在' };
        }
        
        // 检查限购
        if (item.limitCount) {
            const purchasedCount = this.purchaseCount.get(itemId) || 0;
            if (purchasedCount >= item.limitCount) {
                return { success: false, error: '已达购买上限' };
            }
        }
        
        // 检查货币
        const currentAmount = playerCurrency[item.price.currency] || 0;
        const price = item.discount ? Math.floor(item.price.amount * item.discount) : item.price.amount;
        
        if (currentAmount < price) {
            return { success: false, error: '货币不足' };
        }
        
        // 记录购买
        const currentCount = this.purchaseCount.get(itemId) || 0;
        this.purchaseCount.set(itemId, currentCount + 1);
        
        return { 
            success: true, 
            item,
        };
    }
    
    // 手动刷新商店
    public refresh(category: ShopCategory, playerCurrency: { [key: string]: number }): {
        success: boolean;
        error?: string;
    } {
        const config = this.refreshConfigs.get(category);
        if (!config) {
            return { success: false, error: '该分类不支持刷新' };
        }
        
        const currentAmount = playerCurrency[config.refreshCost.currency] || 0;
        if (currentAmount < config.refreshCost.amount) {
            return { success: false, error: '货币不足' };
        }
        
        this.lastRefreshTime.set(category, Date.now());
        return { success: true };
    }
    
    // 获取下次刷新时间
    public getNextRefreshTime(category: ShopCategory): number {
        const config = this.refreshConfigs.get(category);
        if (!config) return 0;
        
        const lastRefresh = this.lastRefreshTime.get(category) || 0;
        return lastRefresh + config.refreshInterval * 1000;
    }
    
    // 重置每日/每周限购
    public resetLimit(limitType: 'daily' | 'weekly' | 'monthly') {
        // 清空对应类型的购买记录
        for (const [category, items] of this.items) {
            items.forEach(item => {
                if (item.limitType === limitType) {
                    this.purchaseCount.delete(item.id);
                }
            });
        }
    }
    
    // 获取购买记录
    public getPurchaseCount(itemId: string): number {
        return this.purchaseCount.get(itemId) || 0;
    }
}

// 单例
export const shopSystem = new ShopSystem();
