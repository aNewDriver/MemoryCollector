/**
 * 排行榜系统
 * 各类排行榜和赛季排名
 */

export enum LeaderboardType {
    POWER = 'power',               // 战力排行
    LEVEL = 'level',               // 等级排行
    ARENA = 'arena',               // 竞技场排行
    TOWER = 'tower',               // 爬塔排行
    GUILD = 'guild',               // 公会排行
    CHAPTER = 'chapter',           // 章节进度
    COLLECTION = 'collection',     // 收集度排行
    ACHIEVEMENT = 'achievement'    // 成就排行
}

export enum LeaderboardPeriod {
    DAILY = 'daily',       // 日榜
    WEEKLY = 'weekly',     // 周榜
    MONTHLY = 'monthly',   // 月榜
    SEASON = 'season',     // 赛季榜
    ALL_TIME = 'all_time'  // 总榜
}

export interface LeaderboardEntry {
    rank: number;
    playerId: string;
    playerName: string;
    avatar?: string;
    level: number;
    vipLevel: number;
    score: number;           // 排名分数
    extraData?: any;         // 额外数据
    updateTime: number;
}

export interface Leaderboard {
    type: LeaderboardType;
    period: LeaderboardPeriod;
    season?: string;         // 赛季ID
    entries: LeaderboardEntry[];
    totalCount: number;      // 总参与人数
    updateTime: number;
    
    // 玩家自己的排名
    selfRank?: LeaderboardEntry;
    selfPercentile?: number; // 百分比排名（如前10%）
}

export interface RankReward {
    minRank: number;
    maxRank: number;
    rewards: {
        gold?: number;
        soulCrystal?: number;
        items?: { itemId: string; count: number }[];
        title?: string;
        frame?: string;
    };
}

export class LeaderboardSystem {
    private leaderboards: Map<string, Leaderboard> = new Map();
    private seasonId: string = '';
    private seasonStartTime: number = 0;
    private seasonEndTime: number = 0;
    
    // 排行榜奖励配置
    private rankRewards: Record<LeaderboardType, RankReward[]> = {
        [LeaderboardType.ARENA]: [
            { minRank: 1, maxRank: 1, rewards: { soulCrystal: 5000, title: '竞技之王', frame: 'arena_king' } },
            { minRank: 2, maxRank: 3, rewards: { soulCrystal: 3000, title: '竞技大师' } },
            { minRank: 4, maxRank: 10, rewards: { soulCrystal: 2000 } },
            { minRank: 11, maxRank: 100, rewards: { soulCrystal: 1000 } },
            { minRank: 101, maxRank: 1000, rewards: { soulCrystal: 500 } }
        ],
        [LeaderboardType.TOWER]: [
            { minRank: 1, maxRank: 1, rewards: { soulCrystal: 3000, title: '塔之主' } },
            { minRank: 2, maxRank: 10, rewards: { soulCrystal: 2000 } },
            { minRank: 11, maxRank: 100, rewards: { soulCrystal: 1000 } }
        ],
        [LeaderboardType.GUILD]: [
            { minRank: 1, maxRank: 1, rewards: { gold: 1000000 } },
            { minRank: 2, maxRank: 3, rewards: { gold: 500000 } },
            { minRank: 4, maxRank: 10, rewards: { gold: 200000 } }
        ]
    };
    
    constructor() {
        this.startNewSeason();
    }
    
    // 开始新赛季
    public startNewSeason(): void {
        const now = Date.now();
        this.seasonId = `season_${now}`;
        this.seasonStartTime = now;
        this.seasonEndTime = now + 30 * 24 * 60 * 60 * 1000;  // 30天赛季
        
        // 清空赛季榜
        this.clearSeasonLeaderboards();
    }
    
    // 更新排行榜
    public updateLeaderboard(
        type: LeaderboardType,
        period: LeaderboardPeriod,
        entries: LeaderboardEntry[],
        playerId?: string
    ): Leaderboard {
        const key = `${type}_${period}_${period === LeaderboardPeriod.SEASON ? this.seasonId : ''}`;
        
        // 排序并限制数量
        const sortedEntries = entries
            .sort((a, b) => b.score - a.score)
            .slice(0, 100)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
        
        const leaderboard: Leaderboard = {
            type,
            period,
            season: period === LeaderboardPeriod.SEASON ? this.seasonId : undefined,
            entries: sortedEntries,
            totalCount: entries.length,
            updateTime: Date.now()
        };
        
        // 设置玩家自己的排名
        if (playerId) {
            const selfEntry = sortedEntries.find(e => e.playerId === playerId);
            if (selfEntry) {
                leaderboard.selfRank = selfEntry;
                leaderboard.selfPercentile = Math.floor(
                    (sortedEntries.length - selfEntry.rank) / sortedEntries.length * 100
                );
            }
        }
        
        this.leaderboards.set(key, leaderboard);
        return leaderboard;
    }
    
    // 获取排行榜
    public getLeaderboard(
        type: LeaderboardType,
        period: LeaderboardPeriod,
        playerId?: string
    ): Leaderboard | null {
        const key = `${type}_${period}_${period === LeaderboardPeriod.SEASON ? this.seasonId : ''}`;
        let leaderboard = this.leaderboards.get(key);
        
        // 如果找不到赛季榜且是赛季榜，返回总榜
        if (!leaderboard && period === LeaderboardPeriod.SEASON) {
            return this.getLeaderboard(type, LeaderboardPeriod.ALL_TIME, playerId);
        }
        
        // 添加玩家排名信息
        if (leaderboard && playerId && !leaderboard.selfRank) {
            const selfEntry = leaderboard.entries.find(e => e.playerId === playerId);
            if (selfEntry) {
                leaderboard = { ...leaderboard };
                leaderboard.selfRank = selfEntry;
                leaderboard.selfPercentile = Math.floor(
                    (leaderboard.totalCount - selfEntry.rank) / leaderboard.totalCount * 100
                );
            }
        }
        
        return leaderboard || null;
    }
    
    // 获取玩家排名
    public getPlayerRank(
        type: LeaderboardType,
        period: LeaderboardPeriod,
        playerId: string
    ): LeaderboardEntry | null {
        const leaderboard = this.getLeaderboard(type, period);
        if (!leaderboard) return null;
        
        return leaderboard.entries.find(e => e.playerId === playerId) || null;
    }
    
    // 获取排名奖励
    public getRankReward(
        type: LeaderboardType,
        rank: number
    ): RankReward['rewards'] | null {
        const rewards = this.rankRewards[type];
        if (!rewards) return null;
        
        const reward = rewards.find(
            r => rank >= r.minRank && rank <= r.maxRank
        );
        
        return reward?.rewards || null;
    }
    
    // 发放赛季奖励
    public distributeSeasonRewards(): void {
        // 竞技场奖励
        const arenaBoard = this.getLeaderboard(LeaderboardType.ARENA, LeaderboardPeriod.SEASON);
        if (arenaBoard) {
            arenaBoard.entries.forEach(entry => {
                const reward = this.getRankReward(LeaderboardType.ARENA, entry.rank);
                if (reward) {
                    // TODO: 发送奖励邮件
                    console.log(`发放竞技场排名奖励给 ${entry.playerName}, 排名: ${entry.rank}`);
                }
            });
        }
        
        // 爬塔奖励
        const towerBoard = this.getLeaderboard(LeaderboardType.TOWER, LeaderboardPeriod.SEASON);
        if (towerBoard) {
            towerBoard.entries.forEach(entry => {
                const reward = this.getRankReward(LeaderboardType.TOWER, entry.rank);
                if (reward) {
                    console.log(`发放爬塔排名奖励给 ${entry.playerName}, 排名: ${entry.rank}`);
                }
            });
        }
    }
    
    // 清理赛季榜
    private clearSeasonLeaderboards(): void {
        const keysToDelete: string[] = [];
        this.leaderboards.forEach((_, key) => {
            if (key.includes('season')) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.leaderboards.delete(key));
    }
    
    // 获取赛季信息
    public getSeasonInfo(): {
        seasonId: string;
        startTime: number;
        endTime: number;
        remainingDays: number;
    } {
        const now = Date.now();
        const remainingTime = this.seasonEndTime - now;
        const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
        
        return {
            seasonId: this.seasonId,
            startTime: this.seasonStartTime,
            endTime: this.seasonEndTime,
            remainingDays: Math.max(0, remainingDays)
        };
    }
    
    // 检查赛季是否结束
    public checkSeasonEnd(): boolean {
        return Date.now() >= this.seasonEndTime;
    }
    
    // 创建示例排行榜数据
    public createSampleLeaderboard(type: LeaderboardType): Leaderboard {
        const samplePlayers = [
            { id: 'p1', name: '龙傲天', level: 80, vip: 10, score: 999999 },
            { id: 'p2', name: '凤九歌', level: 78, vip: 9, score: 888888 },
            { id: 'p3', name: '独孤求败', level: 77, vip: 8, score: 777777 },
            { id: 'p4', name: '东方不败', level: 75, vip: 8, score: 666666 },
            { id: 'p5', name: '西门吹雪', level: 74, vip: 7, score: 555555 }
        ];
        
        const entries: LeaderboardEntry[] = samplePlayers.map((p, i) => ({
            rank: i + 1,
            playerId: p.id,
            playerName: p.name,
            level: p.level,
            vipLevel: p.vip,
            score: p.score,
            updateTime: Date.now()
        }));
        
        return this.updateLeaderboard(type, LeaderboardPeriod.ALL_TIME, entries);
    }
}

// 单例
export const leaderboardSystem = new LeaderboardSystem();
