/**
 * 支付系统
 * 内购、月卡、VIP、礼包
 */

export enum ProductType {
    CRYSTAL = 'crystal',       // 魂晶（基础货币）
    MONTHLY_CARD = 'monthly_card', // 月卡
    VIP = 'vip',               // VIP等级
    GIFT_PACK = 'gift_pack',   // 限时礼包
    WEEKLY_CARD = 'weekly_card', // 周卡
    LIFETIME = 'lifetime'      // 终身卡
}

export interface Product {
    id: string;
    type: ProductType;
    name: string;
    description: string;
    icon: string;
    
    // 价格
    price: {
        amount: number;
        currency: 'CNY' | 'USD';
    };
    
    // 内容
    rewards: {
        soulCrystal?: number;
        gold?: number;
        items?: { itemId: string; count: number }[];
        vipExp?: number;
    };
    
    // 首充双倍
    firstPurchaseBonus?: {
        soulCrystal?: number;
    };
    
    // 限时信息
    isLimited: boolean;
    availableFrom?: number;
    availableTo?: number;
    
    // 标签
    tags: string[];  // 'hot', 'best_value', 'limited', 'first_purchase'
}

export interface PurchaseRecord {
    orderId: string;
    playerId: string;
    productId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    createdAt: number;
    completedAt?: number;
}

export interface MonthlyCardStatus {
    isActive: boolean;
    expireTime: number;
    totalDays: number;
    remainingDays: number;
    dailyClaimed: boolean;
    todayClaimed: boolean;
}

export class PaymentSystem {
    private products: Map<string, Product> = new Map();
    private purchaseHistory: Map<string, PurchaseRecord[]> = new Map();
    private monthlyCardStatus: Map<string, MonthlyCardStatus> = new Map();
    private firstPurchaseRecord: Map<string, Set<string>> = new Map();  // playerId -> productIds
    
    constructor() {
        this.initializeProducts();
    }
    
    private initializeProducts(): void {
        // 魂晶档位
        const crystalProducts: Product[] = [
            { id: 'crystal_60', type: ProductType.CRYSTAL, name: '60魂晶', description: '少量魂晶', icon: 'shop/crystal_60.bmp', price: { amount: 6, currency: 'CNY' }, rewards: { soulCrystal: 60 }, tags: [] },
            { id: 'crystal_300', type: ProductType.CRYSTAL, name: '300魂晶', description: '魂晶', icon: 'shop/crystal_300.bmp', price: { amount: 30, currency: 'CNY' }, rewards: { soulCrystal: 300 }, tags: ['hot'] },
            { id: 'crystal_980', type: ProductType.CRYSTAL, name: '980魂晶', description: '大量魂晶', icon: 'shop/crystal_980.bmp', price: { amount: 98, currency: 'CNY' }, rewards: { soulCrystal: 980 }, firstPurchaseBonus: { soulCrystal: 980 }, tags: ['first_purchase'] },
            { id: 'crystal_1980', type: ProductType.CRYSTAL, name: '1980魂晶', description: '超值魂晶', icon: 'shop/crystal_1980.bmp', price: { amount: 198, currency: 'CNY' }, rewards: { soulCrystal: 1980 }, firstPurchaseBonus: { soulCrystal: 1980 }, tags: ['best_value', 'first_purchase'] },
            { id: 'crystal_3280', type: ProductType.CRYSTAL, name: '3280魂晶', description: '豪华魂晶包', icon: 'shop/crystal_3280.bmp', price: { amount: 328, currency: 'CNY' }, rewards: { soulCrystal: 3280 }, firstPurchaseBonus: { soulCrystal: 3280 }, tags: ['first_purchase'] },
            { id: 'crystal_6480', type: ProductType.CRYSTAL, name: '6480魂晶', description: '至尊魂晶包', icon: 'shop/crystal_6480.bmp', price: { amount: 648, currency: 'CNY' }, rewards: { soulCrystal: 6480, vipExp: 6480 }, firstPurchaseBonus: { soulCrystal: 6480 }, tags: ['first_purchase'] }
        ];
        
        // 月卡
        const monthlyCard: Product = {
            id: 'monthly_card',
            type: ProductType.MONTHLY_CARD,
            name: '至尊月卡',
            description: '30天内每日领取300魂晶+50000金币',
            icon: 'shop/monthly_card.bmp',
            price: { amount: 30, currency: 'CNY' },
            rewards: { soulCrystal: 300, gold: 50000 },
            tags: ['best_value', 'hot']
        };
        
        // 周卡
        const weeklyCard: Product = {
            id: 'weekly_card',
            type: ProductType.WEEKLY_CARD,
            name: '特权周卡',
            description: '7天内每日领取100魂晶',
            icon: 'shop/weekly_card.bmp',
            price: { amount: 12, currency: 'CNY' },
            rewards: { soulCrystal: 100 },
            tags: []
        };
        
        // 限时礼包
        const giftPacks: Product[] = [
            {
                id: 'starter_pack',
                type: ProductType.GIFT_PACK,
                name: '新手礼包',
                description: '超值新手资源包',
                icon: 'shop/starter_pack.bmp',
                price: { amount: 6, currency: 'CNY' },
                rewards: { soulCrystal: 300, gold: 100000, items: [{ itemId: 'gacha_ticket', count: 10 }] },
                isLimited: true,
                tags: ['limited', 'hot']
            },
            {
                id: 'weekly_pack',
                type: ProductType.GIFT_PACK,
                name: '每周礼包',
                description: '每周限购',
                icon: 'shop/weekly_pack.bmp',
                price: { amount: 68, currency: 'CNY' },
                rewards: { soulCrystal: 680, gold: 200000, items: [{ itemId: 'gacha_ticket', count: 20 }] },
                isLimited: true,
                tags: ['limited']
            }
        ];
        
        [...crystalProducts, monthlyCard, weeklyCard, ...giftPacks].forEach(p => {
            this.products.set(p.id, p);
        });
    }
    
    // 获取商品列表
    public getProducts(type?: ProductType): Product[] {
        const products = Array.from(this.products.values());
        if (type) {
            return products.filter(p => p.type === type);
        }
        return products;
    }
    
    // 获取商品
    public getProduct(productId: string): Product | null {
        return this.products.get(productId) || null;
    }
    
    // 创建订单
    public createOrder(
        playerId: string,
        productId: string
    ): {
        success: boolean;
        orderId?: string;
        error?: string;
    } {
        const product = this.products.get(productId);
        if (!product) return { success: false, error: '商品不存在' };
        
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const record: PurchaseRecord = {
            orderId,
            playerId,
            productId,
            amount: product.price.amount,
            currency: product.price.currency,
            status: 'pending',
            createdAt: Date.now()
        };
        
        if (!this.purchaseHistory.has(playerId)) {
            this.purchaseHistory.set(playerId, []);
        }
        this.purchaseHistory.get(playerId)!.push(record);
        
        return { success: true, orderId };
    }
    
    // 完成订单（支付成功后调用）
    public completeOrder(orderId: string): {
        success: boolean;
        rewards?: any;
        error?: string;
    } {
        // 查找订单
        let record: PurchaseRecord | null = null;
        let playerId: string = '';
        
        for (const [pid, records] of this.purchaseHistory) {
            const found = records.find(r => r.orderId === orderId);
            if (found) {
                record = found;
                playerId = pid;
                break;
            }
        }
        
        if (!record) return { success: false, error: '订单不存在' };
        if (record.status !== 'pending') return { success: false, error: '订单状态错误' };
        
        record.status = 'completed';
        record.completedAt = Date.now();
        
        const product = this.products.get(record.productId)!;
        let rewards = { ...product.rewards };
        
        // 首充奖励
        const isFirstPurchase = !this.firstPurchaseRecord.get(playerId)?.has(product.id);
        if (isFirstPurchase && product.firstPurchaseBonus) {
            rewards.soulCrystal = (rewards.soulCrystal || 0) + (product.firstPurchaseBonus.soulCrystal || 0);
            
            // 记录首充
            if (!this.firstPurchaseRecord.has(playerId)) {
                this.firstPurchaseRecord.set(playerId, new Set());
            }
            this.firstPurchaseRecord.get(playerId)!.add(product.id);
        }
        
        // 处理月卡
        if (product.type === ProductType.MONTHLY_CARD) {
            this.activateMonthlyCard(playerId);
        }
        
        return { success: true, rewards };
    }
    
    // 激活月卡
    private activateMonthlyCard(playerId: string): void {
        const now = Date.now();
        const status: MonthlyCardStatus = {
            isActive: true,
            expireTime: now + 30 * 24 * 60 * 60 * 1000,
            totalDays: 30,
            remainingDays: 30,
            dailyClaimed: false,
            todayClaimed: false
        };
        this.monthlyCardStatus.set(playerId, status);
    }
    
    // 获取月卡状态
    public getMonthlyCardStatus(playerId: string): MonthlyCardStatus | null {
        return this.monthlyCardStatus.get(playerId) || null;
    }
    
    // 领取月卡每日奖励
    public claimMonthlyCardReward(playerId: string): {
        success: boolean;
        rewards?: any;
        error?: string;
    } {
        const status = this.monthlyCardStatus.get(playerId);
        if (!status || !status.isActive) {
            return { success: false, error: '月卡未激活' };
        }
        
        if (status.todayClaimed) {
            return { success: false, error: '今日已领取' };
        }
        
        status.todayClaimed = true;
        status.dailyClaimed = true;
        
        return {
            success: true,
            rewards: { soulCrystal: 300, gold: 50000 }
        };
    }
    
    // 每日重置月卡
    public dailyReset(): void {
        this.monthlyCardStatus.forEach(status => {
            const now = Date.now();
            if (now > status.expireTime) {
                status.isActive = false;
            } else {
                status.remainingDays = Math.ceil((status.expireTime - now) / (24 * 60 * 60 * 1000));
                status.todayClaimed = false;
            }
        });
    }
    
    // 获取购买历史
    public getPurchaseHistory(playerId: string): PurchaseRecord[] {
        return this.purchaseHistory.get(playerId) || [];
    }
    
    // 获取累计充值金额
    public getTotalSpent(playerId: string): number {
        const history = this.purchaseHistory.get(playerId) || [];
        return history
            .filter(r => r.status === 'completed')
            .reduce((sum, r) => sum + r.amount, 0);
    }
}

// 单例
export const paymentSystem = new PaymentSystem();
