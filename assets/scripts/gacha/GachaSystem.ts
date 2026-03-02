/**
 * 抽卡系统
 * 酒馆抽卡逻辑
 */

import { CardData, Rarity } from './CardData.ts';
import { getAllCards, getCardsByRarity } from './CardDatabase.ts';

// 卡池配置
export interface GachaPool {
    id: string;
    name: string;
    description: string;
    
    // 单抽价格
    singleCost: { currency: string; amount: number };
    
    // 十连价格（通常有折扣）
    tenCost: { currency: string; amount: number };
    
    // 概率配置
    rates: GachaRates;
    
    // 保底配置
    pity: PityConfig;
    
    // 限定卡牌（可选）
    featuredCards?: string[];
    
    // 卡池时间限制
    startTime?: number;
    endTime?: number;
}

export interface GachaRates {
    [Rarity.COMMON]: number;   // 普通 50%
    [Rarity.RARE]: number;     // 稀有 35%
    [Rarity.EPIC]: number;     // 史诗 12%
    [Rarity.LEGEND]: number;   // 传说 2.5%
    [Rarity.MYTH]: number;     // 神话 0.5%
}

export interface PityConfig {
    // 保底次数（多少抽必出指定稀有度）
    guaranteedRarity: Rarity;
    guaranteedCount: number;
    
    // 软保底（概率递增起始点）
    softPityStart?: number;
    softPityRateIncrease?: number;
}

// 抽卡结果
export interface GachaResult {
    cardId: string;
    rarity: Rarity;
    isNew: boolean;  // 是否首次获得
    isFeatured?: boolean;  // 是否UP卡牌
}

// 抽卡记录
export interface GachaRecord {
    poolId: string;
    timestamp: number;
    results: GachaResult[];
    cost: { currency: string; amount: number };
}

// 标准卡池配置
export const STANDARD_POOL: GachaPool = {
    id: 'standard',
    name: '记忆呼唤',
    description: '所有非限定卡牌均可获得',
    singleCost: { currency: 'soul_crystal', amount: 300 },
    tenCost: { currency: 'soul_crystal', amount: 2700 },  // 九折
    rates: {
        [Rarity.COMMON]: 50,
        [Rarity.RARE]: 35,
        [Rarity.EPIC]: 12,
        [Rarity.LEGEND]: 2.5,
        [Rarity.MYTH]: 0.5
    },
    pity: {
        guaranteedRarity: Rarity.EPIC,
        guaranteedCount: 30,  // 30抽保底史诗
        softPityStart: 25,
        softPityRateIncrease: 5  // 25抽后每抽增加5%史诗概率
    }
};

// UP卡池配置示例
export const FEATURED_POOL: GachaPool = {
    id: 'featured_ming_zhu',
    name: '光明引路',
    description: '传说角色「明烛」出现概率UP',
    singleCost: { currency: 'soul_crystal', amount: 300 },
    tenCost: { currency: 'soul_crystal', amount: 2700 },
    rates: {
        [Rarity.COMMON]: 50,
        [Rarity.RARE]: 35,
        [Rarity.EPIC]: 10,
        [Rarity.LEGEND]: 4.5,  // UP池传说概率略高
        [Rarity.MYTH]: 0.5
    },
    pity: {
        guaranteedRarity: Rarity.LEGEND,
        guaranteedCount: 80,  // 80抽保底传说
        softPityStart: 70,
        softPityRateIncrease: 5
    },
    featuredCards: ['ming_zhu']  // 明烛UP
};

// 友情点卡池（低稀有度，但免费）
export const FRIENDSHIP_POOL: GachaPool = {
    id: 'friendship',
    name: '羁绊之证',
    description: '消耗友情点进行召唤',
    singleCost: { currency: 'friend_point', amount: 200 },
    tenCost: { currency: 'friend_point', amount: 2000 },
    rates: {
        [Rarity.COMMON]: 75,
        [Rarity.RARE]: 23,
        [Rarity.EPIC]: 2,
        [Rarity.LEGEND]: 0,
        [Rarity.MYTH]: 0
    },
    pity: {
        guaranteedRarity: Rarity.RARE,
        guaranteedCount: 10  // 10抽保底稀有
    }
};

export class GachaSystem {
    private pools: Map<string, GachaPool> = new Map();
    private playerPityCounter: Map<string, number> = new Map();  // 每个卡池的保底计数
    private ownedCards: Set<string> = new Set();  // 已拥有的卡牌
    private gachaHistory: GachaRecord[] = [];
    
    constructor() {
        this.registerPool(STANDARD_POOL);
        this.registerPool(FEATURED_POOL);
        this.registerPool(FRIENDSHIP_POOL);
    }
    
    public registerPool(pool: GachaPool) {
        this.pools.set(pool.id, pool);
        if (!this.playerPityCounter.has(pool.id)) {
            this.playerPityCounter.set(pool.id, 0);
        }
    }
    
    // 单抽
    public singlePull(poolId: string): GachaResult {
        const pool = this.pools.get(poolId);
        if (!pool) throw new Error(`卡池不存在: ${poolId}`);
        
        // 增加保底计数
        const currentPity = this.playerPityCounter.get(poolId)! + 1;
        this.playerPityCounter.set(poolId, currentPity);
        
        // 判断保底
        let result: GachaResult;
        if (currentPity >= pool.pity.guaranteedCount) {
            // 触发保底
            result = this.generateGuaranteedResult(pool);
            this.playerPityCounter.set(poolId, 0);  // 重置保底
        } else {
            // 正常抽卡
            result = this.generateRandomResult(pool, currentPity);
            if (result.rarity >= pool.pity.guaranteedRarity) {
                this.playerPityCounter.set(poolId, 0);  // 提前出高稀有度，重置保底
            }
        }
        
        // 记录结果
        this.recordGacha(pool, [result]);
        
        return result;
    }
    
    // 十连抽
    public tenPull(poolId: string): GachaResult[] {
        const results: GachaResult[] = [];
        
        for (let i = 0; i < 9; i++) {
            results.push(this.singlePull(poolId));
        }
        
        // 第十抽保底至少稀有
        const pool = this.pools.get(poolId)!;
        const lastResult = this.generateMinimumRarity(pool, Rarity.RARE);
        results.push(lastResult);
        
        return results;
    }
    
    private generateRandomResult(pool: GachaPool, currentPity: number): GachaResult {
        // 计算实际概率（考虑软保底）
        let rates = { ...pool.rates };
        
        if (pool.pity.softPityStart && currentPity >= pool.pity.softPityStart) {
            const increase = (currentPity - pool.pity.softPityStart + 1) * 
                (pool.pity.softPityRateIncrease || 0);
            
            // 增加高稀有度概率，降低低稀有度
            if (rates[Rarity.EPIC] !== undefined) {
                rates[Rarity.EPIC] += increase;
                rates[Rarity.COMMON] -= increase;
            }
        }
        
        // 根据概率抽取稀有度
        const roll = Math.random() * 100;
        let cumulative = 0;
        let selectedRarity = Rarity.COMMON;
        
        for (let r = Rarity.MYTH; r >= Rarity.COMMON; r--) {
            cumulative += rates[r] || 0;
            if (roll <= cumulative) {
                selectedRarity = r;
                break;
            }
        }
        
        return this.generateCardByRarity(pool, selectedRarity);
    }
    
    private generateGuaranteedResult(pool: GachaPool): GachaResult {
        // 保底出指定稀有度
        const targetRarity = pool.pity.guaranteedRarity;
        return this.generateCardByRarity(pool, targetRarity);
    }
    
    private generateMinimumRarity(pool: GachaPool, minRarity: Rarity): GachaResult {
        // 确保至少指定稀有度
        const roll = Math.random() * 100;
        let cumulative = 0;
        
        for (let r = Rarity.MYTH; r >= minRarity; r--) {
            cumulative += pool.rates[r] || 0;
            if (roll <= cumulative) {
                return this.generateCardByRarity(pool, r);
            }
        }
        
        return this.generateCardByRarity(pool, minRarity);
    }
    
    private generateCardByRarity(pool: GachaPool, rarity: Rarity): GachaResult {
        let candidates: CardData[] = [];
        
        // 如果有UP卡牌且稀有度匹配，优先从UP池中选
        if (pool.featuredCards && pool.featuredCards.length > 0) {
            const allCards = getAllCards();
            const featured = allCards.filter(c => 
                pool.featuredCards?.includes(c.id) && c.rarity === rarity
            );
            
            // UP卡牌有50%概率被选中（如果存在）
            if (featured.length > 0 && Math.random() < 0.5) {
                candidates = featured;
            }
        }
        
        // 如果没有UP候选，从该稀有度所有卡牌中选
        if (candidates.length === 0) {
            candidates = getCardsByRarity(rarity);
        }
        
        // 随机选择一张
        const selectedCard = candidates[Math.floor(Math.random() * candidates.length)];
        
        const isNew = !this.ownedCards.has(selectedCard.id);
        if (isNew) {
            this.ownedCards.add(selectedCard.id);
        }
        
        return {
            cardId: selectedCard.id,
            rarity: selectedCard.rarity,
            isNew,
            isFeatured: pool.featuredCards?.includes(selectedCard.id)
        };
    }
    
    private recordGacha(pool: GachaPool, results: GachaResult[]) {
        const record: GachaRecord = {
            poolId: pool.id,
            timestamp: Date.now(),
            results,
            cost: { 
                currency: results.length === 10 ? pool.tenCost.currency : pool.singleCost.currency,
                amount: results.length === 10 ? pool.tenCost.amount : pool.singleCost.amount
            }
        };
        
        this.gachaHistory.unshift(record);
        
        // 只保留最近100条记录
        if (this.gachaHistory.length > 100) {
            this.gachaHistory.pop();
        }
    }
    
    // 获取保底计数
    public getPityCount(poolId: string): number {
        return this.playerPityCounter.get(poolId) || 0;
    }
    
    // 获取抽卡历史
    public getGachaHistory(limit: number = 10): GachaRecord[] {
        return this.gachaHistory.slice(0, limit);
    }
    
    // 获取所有卡池
    public getAllPools(): GachaPool[] {
        return Array.from(this.pools.values());
    }
    
    // 获取指定卡池
    public getPool(poolId: string): GachaPool | undefined {
        return this.pools.get(poolId);
    }
}

// 单例
export const gachaSystem = new GachaSystem();
