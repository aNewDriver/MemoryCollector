/**
 * 自动战斗/挂机系统
 * 离线收益、自动推图
 */

export interface IdleReward {
    gold: number;
    exp: number;
    items: { itemId: string; count: number }[];
    cards: string[];
}

export interface IdleConfig {
    maxOfflineTime: number;       // 最大离线时间（毫秒）
    goldPerMinute: number;
    expPerMinute: number;
    itemDropChance: number;       // 每分钟物品掉落概率
}

export class IdleSystem {
    private config: IdleConfig = {
        maxOfflineTime: 8 * 60 * 60 * 1000,  // 8小时
        goldPerMinute: 100,
        expPerMinute: 50,
        itemDropChance: 0.1
    };
    
    private playerOfflineTime: Map<string, number> = new Map();  // playerId -> lastOnlineTime
    private autoBattleEnabled: Map<string, boolean> = new Map();
    private autoBattleStage: Map<string, number> = new Map();  // 自动推图进度
    
    // 玩家上线，计算离线收益
    public playerLogin(playerId: string): {
        offlineTime: number;
        rewards: IdleReward;
    } {
        const lastOnline = this.playerOfflineTime.get(playerId);
        const now = Date.now();
        
        let offlineTime = 0;
        if (lastOnline) {
            offlineTime = Math.min(now - lastOnline, this.config.maxOfflineTime);
        }
        
        // 计算收益
        const minutes = Math.floor(offlineTime / 60000);
        const rewards = this.calculateRewards(minutes);
        
        // 更新在线时间
        this.playerOfflineTime.set(playerId, now);
        
        return { offlineTime, rewards };
    }
    
    // 计算离线收益
    private calculateRewards(minutes: number): IdleReward {
        const rewards: IdleReward = {
            gold: minutes * this.config.goldPerMinute,
            exp: minutes * this.config.expPerMinute,
            items: [],
            cards: []
        };
        
        // 物品掉落
        for (let i = 0; i < minutes; i++) {
            if (Math.random() < this.config.itemDropChance) {
                const items = ['memory_dust', 'gold_chest', 'equipment_box'];
                const item = items[Math.floor(Math.random() * items.length)];
                rewards.items.push({ itemId: item, count: 1 });
            }
        }
        
        return rewards;
    }
    
    // 开启自动战斗
    public enableAutoBattle(playerId: string, startStage: number): void {
        this.autoBattleEnabled.set(playerId, true);
        this.autoBattleStage.set(playerId, startStage);
    }
    
    // 关闭自动战斗
    public disableAutoBattle(playerId: string): void {
        this.autoBattleEnabled.set(playerId, false);
    }
    
    // 检查自动战斗进度
    public checkAutoBattleProgress(playerId: string, playerPower: number): {
        hasProgress: boolean;
        newStage?: number;
        battleCount?: number;
        rewards?: IdleReward;
    } {
        if (!this.autoBattleEnabled.get(playerId)) {
            return { hasProgress: false };
        }
        
        const lastCheck = this.playerOfflineTime.get(playerId) || Date.now();
        const now = Date.now();
        const minutesPassed = Math.floor((now - lastCheck) / 60000);
        
        if (minutesPassed < 1) {
            return { hasProgress: false };
        }
        
        // 模拟自动战斗进度
        const currentStage = this.autoBattleStage.get(playerId) || 1;
        let newStage = currentStage;
        let battleCount = 0;
        
        // 假设每分钟可以尝试推进1关
        for (let i = 0; i < minutesPassed; i++) {
            // 成功率随关卡提升而降低
            const successRate = Math.max(0.1, 0.9 - (newStage * 0.01));
            if (Math.random() < successRate) {
                newStage++;
                battleCount++;
            }
        }
        
        this.autoBattleStage.set(playerId, newStage);
        
        // 计算收益
        const rewards = this.calculateRewards(minutesPassed);
        rewards.gold += battleCount * 1000;  // 通关额外金币
        
        return {
            hasProgress: newStage > currentStage,
            newStage,
            battleCount,
            rewards
        };
    }
    
    // 获取当前自动推图进度
    public getAutoBattleStage(playerId: string): number {
        return this.autoBattleStage.get(playerId) || 1;
    }
    
    // 更新配置
    public updateConfig(config: Partial<IdleConfig>): void {
        Object.assign(this.config, config);
    }
    
    // 玩家下线
    public playerLogout(playerId: string): void {
        this.playerOfflineTime.set(playerId, Date.now());
    }
}

// 单例
export const idleSystem = new IdleSystem();
