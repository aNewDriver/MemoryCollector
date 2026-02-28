/**
 * 赛季系统
 * 周期性重置、赛季专属奖励
 */

export interface Season {
    id: string;
    name: string;
    theme: string;
    
    // 时间
    startTime: number;
    endTime: number;
    
    // 赛季专属内容
    exclusiveCards: string[];
    exclusiveSkins: string[];
    exclusiveEvents: string[];
    
    // 赛季奖励
    rewards: SeasonReward[];
}

export interface SeasonReward {
    tier: number;
    requiredPoints: number;
    freeReward: any;
    premiumReward?: any;
}

export interface PlayerSeasonData {
    playerId: string;
    seasonId: string;
    points: number;
    tier: number;
    isPremium: boolean;
    claimedRewards: number[];
    
    // 赛季统计
    stats: {
        battlesWon: number;
        cardsCollected: number;
        achievementsCompleted: number;
    };
}

export class SeasonSystem {
    private currentSeason: Season | null = null;
    private playerData: Map<string, PlayerSeasonData> = new Map();
    private seasonHistory: Map<string, Season> = new Map();
    
    // 创建新赛季
    public createSeason(
        id: string,
        name: string,
        theme: string,
        durationDays: number
    ): Season {
        const now = Date.now();
        const season: Season = {
            id,
            name,
            theme,
            startTime: now,
            endTime: now + durationDays * 24 * 60 * 60 * 1000,
            exclusiveCards: [],
            exclusiveSkins: [],
            exclusiveEvents: [],
            rewards: this.generateSeasonRewards()
        };
        
        this.currentSeason = season;
        this.seasonHistory.set(id, season);
        
        return season;
    }
    
    // 生成赛季奖励
    private generateSeasonRewards(): SeasonReward[] {
        const rewards: SeasonReward[] = [];
        
        for (let tier = 1; tier <= 50; tier++) {
            rewards.push({
                tier,
                requiredPoints: tier * 100,
                freeReward: this.getFreeReward(tier),
                premiumReward: this.getPremiumReward(tier)
            });
        }
        
        return rewards;
    }
    
    // 免费奖励
    private getFreeReward(tier: number): any {
        if (tier === 1) return { gold: 10000 };
        if (tier === 10) return { gachaTickets: 5 };
        if (tier === 25) return { soulCrystal: 500 };
        if (tier === 50) return { exclusiveCard: 'season_legendary' };
        return { gold: 5000 * tier };
    }
    
    // 高级奖励
    private getPremiumReward(tier: number): any {
        if (tier === 1) return { soulCrystal: 1000 };
        if (tier === 10) return { gachaTickets: 20 };
        if (tier === 25) return { exclusiveSkin: 'season_skin' };
        if (tier === 50) return { exclusiveFrame: 'season_frame' };
        return { soulCrystal: 100 * tier };
    }
    
    // 获取当前赛季
    public getCurrentSeason(): Season | null {
        return this.currentSeason;
    }
    
    // 检查赛季是否进行中
    public isSeasonActive(): boolean {
        if (!this.currentSeason) return false;
        const now = Date.now();
        return now >= this.currentSeason.startTime && now <= this.currentSeason.endTime;
    }
    
    // 获取剩余时间
    public getRemainingTime(): number {
        if (!this.currentSeason) return 0;
        return Math.max(0, this.currentSeason.endTime - Date.now());
    }
    
    // 获取玩家赛季数据
    public getPlayerSeasonData(playerId: string): PlayerSeasonData | null {
        if (!this.currentSeason) return null;
        
        const key = `${playerId}_${this.currentSeason.id}`;
        if (!this.playerData.has(key)) {
            this.playerData.set(key, {
                playerId,
                seasonId: this.currentSeason.id,
                points: 0,
                tier: 1,
                isPremium: false,
                claimedRewards: [],
                stats: {
                    battlesWon: 0,
                    cardsCollected: 0,
                    achievementsCompleted: 0
                }
            });
        }
        
        return this.playerData.get(key)!;
    }
    
    // 添加赛季点数
    public addPoints(playerId: string, points: number): void {
        const data = this.getPlayerSeasonData(playerId);
        if (!data) return;
        
        data.points += points;
        
        // 检查是否升级
        this.checkTierUp(playerId);
    }
    
    // 检查升级
    private checkTierUp(playerId: string): void {
        const data = this.getPlayerSeasonData(playerId);
        if (!data || !this.currentSeason) return;
        
        while (data.tier < 50) {
            const nextTier = this.currentSeason.rewards.find(r => r.tier === data.tier + 1);
            if (!nextTier || data.points < nextTier.requiredPoints) break;
            
            data.tier++;
            console.log(`玩家 ${playerId} 赛季等级提升至 ${data.tier}`);
        }
    }
    
    // 升级高级通行证
    public upgradeToPremium(playerId: string): boolean {
        const data = this.getPlayerSeasonData(playerId);
        if (!data || data.isPremium) return false;
        
        data.isPremium = true;
        return true;
    }
    
    // 领取奖励
    public claimReward(playerId: string, tier: number): {
        success: boolean;
        rewards?: any;
        error?: string;
    } {
        const data = this.getPlayerSeasonData(playerId);
        if (!data || !this.currentSeason) return { success: false, error: '赛季未激活' };
        
        if (data.tier < tier) {
            return { success: false, error: '等级不足' };
        }
        
        if (data.claimedRewards.includes(tier)) {
            return { success: false, error: '已领取' };
        }
        
        const reward = this.currentSeason.rewards.find(r => r.tier === tier);
        if (!reward) return { success: false, error: '奖励不存在' };
        
        data.claimedRewards.push(tier);
        
        const rewards: any = { ...reward.freeReward };
        if (data.isPremium && reward.premiumReward) {
            Object.assign(rewards, reward.premiumReward);
        }
        
        return { success: true, rewards };
    }
    
    // 赛季结算
    public endSeason(): void {
        if (!this.currentSeason) return;
        
        console.log(`赛季 ${this.currentSeason.name} 结束`);
        
        // 发放结算奖励
        this.playerData.forEach((data) => {
            if (data.seasonId === this.currentSeason!.id) {
                // 根据排名发放奖励
                console.log(`玩家 ${data.playerId} 赛季结算: 等级 ${data.tier}`);
            }
        });
        
        this.currentSeason = null;
    }
    
    // 获取排行榜
    public getLeaderboard(limit: number = 100): {
        rank: number;
        playerId: string;
        points: number;
        tier: number;
    }[] {
        if (!this.currentSeason) return [];
        
        const entries: { playerId: string; points: number; tier: number }[] = [];
        
        this.playerData.forEach((data) => {
            if (data.seasonId === this.currentSeason!.id) {
                entries.push({
                    playerId: data.playerId,
                    points: data.points,
                    tier: data.tier
                });
            }
        });
        
        return entries
            .sort((a, b) => b.points - a.points)
            .slice(0, limit)
            .map((e, i) => ({ ...e, rank: i + 1 }));
    }
}

// 单例
export const seasonSystem = new SeasonSystem();
