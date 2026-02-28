/**
 * 幸运转盘/抽奖系统
 * 每日免费抽奖、累计奖励
 */

export enum RouletteType {
    DAILY = 'daily',       // 每日转盘
    EVENT = 'event',       // 活动转盘
    VIP = 'vip'            // VIP转盘
}

export interface RoulettePrize {
    id: string;
    name: string;
    icon: string;
    weight: number;         // 权重
    rewards: {
        gold?: number;
        soulCrystal?: number;
        items?: { itemId: string; count: number }[];
        cardId?: string;
    };
    isRare: boolean;        // 是否为稀有奖励
}

export interface RouletteData {
    type: RouletteType;
    prizes: RoulettePrize[];
    dailyFreeCount: number;
    maxDailyFree: number;
    costPerSpin: { currency: string; amount: number };
    
    // 累计抽奖奖励
    cumulativeRewards: {
        spinCount: number;
        reward: any;
        claimed: boolean;
    }[];
}

export class RouletteSystem {
    private roulettes: Map<RouletteType, RouletteData> = new Map();
    private playerSpins: Map<string, {
        type: RouletteType;
        spinCount: number;
        lastSpinTime: number;
        dailySpins: number;
        claimedCumulative: number[];
    }[]> = new Map();
    
    // 初始化转盘
    public initializeRoulette(type: RouletteType): void {
        const defaultPrizes: RoulettePrize[] = [
            { id: 'prize_1', name: '少量金币', icon: 'prize_gold_small.bmp', weight: 30, rewards: { gold: 1000 }, isRare: false },
            { id: 'prize_2', name: '中量金币', icon: 'prize_gold_medium.bmp', weight: 25, rewards: { gold: 5000 }, isRare: false },
            { id: 'prize_3', name: '大量金币', icon: 'prize_gold_large.bmp', weight: 15, rewards: { gold: 20000 }, isRare: false },
            { id: 'prize_4', name: '魂晶', icon: 'prize_crystal.bmp', weight: 15, rewards: { soulCrystal: 100 }, isRare: false },
            { id: 'prize_5', name: '召唤券', icon: 'prize_ticket.bmp', weight: 10, rewards: { items: [{ itemId: 'gacha_ticket', count: 1 }] }, isRare: true },
            { id: 'prize_6', name: '稀有卡牌', icon: 'prize_card.bmp', weight: 4, rewards: { cardId: 'random_blue' }, isRare: true },
            { id: 'prize_7', name: '史诗卡牌', icon: 'prize_epic.bmp', weight: 1, rewards: { cardId: 'random_purple' }, isRare: true }
        ];
        
        const roulette: RouletteData = {
            type,
            prizes: defaultPrizes,
            dailyFreeCount: type === RouletteType.DAILY ? 1 : 0,
            maxDailyFree: type === RouletteType.DAILY ? 1 : 0,
            costPerSpin: { currency: 'soul_crystal', amount: type === RouletteType.VIP ? 100 : 50 },
            cumulativeRewards: [
                { spinCount: 10, reward: { gold: 10000 }, claimed: false },
                { spinCount: 50, reward: { soulCrystal: 500 }, claimed: false },
                { spinCount: 100, reward: { cardId: 'random_purple' }, claimed: false }
            ]
        };
        
        this.roulettes.set(type, roulette);
    }
    
    // 抽奖
    public spin(
        playerId: string,
        type: RouletteType
    ): {
        success: boolean;
        prize?: RoulettePrize;
        isFree?: boolean;
        error?: string;
    } {
        const roulette = this.roulettes.get(type);
        if (!roulette) return { success: false, error: '转盘类型不存在' };
        
        const playerData = this.getPlayerSpinData(playerId, type);
        
        // 检查免费次数
        let isFree = false;
        if (playerData.dailySpins < roulette.dailyFreeCount) {
            isFree = true;
            playerData.dailySpins++;
        } else {
            // TODO: 扣除货币
        }
        
        // 加权随机选择奖品
        const totalWeight = roulette.prizes.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        
        let selectedPrize: RoulettePrize | null = null;
        for (const prize of roulette.prizes) {
            random -= prize.weight;
            if (random <= 0) {
                selectedPrize = prize;
                break;
            }
        }
        
        if (!selectedPrize) {
            selectedPrize = roulette.prizes[roulette.prizes.length - 1];
        }
        
        // 更新数据
        playerData.spinCount++;
        playerData.lastSpinTime = Date.now();
        
        return {
            success: true,
            prize: selectedPrize,
            isFree
        };
    }
    
    // 领取累计奖励
    public claimCumulativeReward(
        playerId: string,
        type: RouletteType,
        spinCount: number
    ): {
        success: boolean;
        reward?: any;
        error?: string;
    } {
        const roulette = this.roulettes.get(type);
        if (!roulette) return { success: false, error: '转盘不存在' };
        
        const cumReward = roulette.cumulativeRewards.find(r => r.spinCount === spinCount);
        if (!cumReward) return { success: false, error: '奖励不存在' };
        
        const playerData = this.getPlayerSpinData(playerId, type);
        if (playerData.spinCount < spinCount) {
            return { success: false, error: '抽奖次数不足' };
        }
        
        if (playerData.claimedCumulative.includes(spinCount)) {
            return { success: false, error: '已领取' };
        }
        
        playerData.claimedCumulative.push(spinCount);
        return { success: true, reward: cumReward.reward };
    }
    
    // 获取玩家转盘数据
    private getPlayerSpinData(playerId: string, type: RouletteType) {
        if (!this.playerSpins.has(playerId)) {
            this.playerSpins.set(playerId, []);
        }
        
        const spins = this.playerSpins.get(playerId)!;
        let data = spins.find(s => s.type === type);
        
        if (!data) {
            data = {
                type,
                spinCount: 0,
                lastSpinTime: 0,
                dailySpins: 0,
                claimedCumulative: []
            };
            spins.push(data);
        }
        
        return data;
    }
    
    // 每日重置
    public dailyReset(): void {
        this.playerSpins.forEach(spins => {
            spins.forEach(data => {
                data.dailySpins = 0;
            });
        });
    }
}

// 单例
export const rouletteSystem = new RouletteSystem();
