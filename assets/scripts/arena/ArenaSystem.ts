/**
 * 竞技场/PVP系统
 * 异步对战，争夺排名
 */

export interface ArenaPlayer {
    playerId: string;
    name: string;
    level: number;
    power: number;
    rank: number;
    defenseTeam: string[];  // 防守阵容卡牌ID列表
    winStreak: number;
    totalWins: number;
    totalLosses: number;
}

export interface ArenaBattle {
    id: string;
    attacker: ArenaPlayer;
    defender: ArenaPlayer;
    result: 'attacker_win' | 'defender_win';
    timestamp: number;
    replay?: BattleReplay;
}

export interface BattleReplay {
    turns: TurnData[];
    finalStats: {
        attackerRemainingHp: number;
        defenderRemainingHp: number;
        turnsCount: number;
    };
}

export interface TurnData {
    turn: number;
    action: 'attack' | 'skill' | 'passive';
    actor: string;
    target: string;
    damage?: number;
    heal?: number;
    effects?: string[];
}

export interface ArenaReward {
    rank: number;
    dailyReward: {
        gold: number;
        soulCrystal: number;
        arenaCoin: number;
    };
    seasonReward?: {
        specialCard?: string;
        exclusiveFrame?: string;
        title?: string;
    };
}

// 竞技场赛季配置
export interface ArenaSeason {
    id: string;
    name: string;
    startTime: number;
    endTime: number;
    specialRules?: string[];
}

export class ArenaSystem {
    private rankings: ArenaPlayer[] = [];
    private battles: ArenaBattle[] = [];
    private currentSeason: ArenaSeason | null = null;
    private playerDailyBattles: Map<string, number> = new Map();
    private readonly MAX_DAILY_BATTLES = 10;
    
    // 初始化排行榜（模拟数据）
    constructor() {
        this.initializeRankings();
    }
    
    private initializeRankings() {
        // 创建AI玩家填充排行榜
        const aiNames = ['Alex', 'Blake', 'Casey', 'Drew', 'Eden', 'Flynn', 'Gray', 'Harper'];
        const aiTitles = ['守护者', '征服者', '破坏者', '智者', '影舞者'];
        
        for (let i = 0; i < 100; i++) {
            this.rankings.push({
                playerId: `ai_${i}`,
                name: `${aiNames[i % aiNames.length]}_${Math.floor(Math.random() * 100)}`,
                level: 30 + Math.floor(Math.random() * 50),
                power: 5000 + Math.floor(Math.random() * 15000),
                rank: i + 1,
                defenseTeam: [],
                winStreak: Math.floor(Math.random() * 10),
                totalWins: Math.floor(Math.random() * 100),
                totalLosses: Math.floor(Math.random() * 50)
            });
        }
    }
    
    // 获取排行榜
    public getRankings(start: number = 0, count: number = 50): ArenaPlayer[] {
        return this.rankings.slice(start, start + count);
    }
    
    // 获取玩家排名
    public getPlayerRank(playerId: string): number {
        const player = this.rankings.find(p => p.playerId === playerId);
        return player?.rank || 0;
    }
    
    // 获取可挑战的对手（排名附近的玩家）
    public getOpponents(playerId: string): ArenaPlayer[] {
        const playerRank = this.getPlayerRank(playerId);
        if (playerRank === 0) return this.rankings.slice(0, 5);
        
        // 获取排名前后的玩家
        const start = Math.max(0, playerRank - 3);
        const end = Math.min(this.rankings.length, playerRank + 2);
        
        return this.rankings
            .slice(start, end)
            .filter(p => p.playerId !== playerId);
    }
    
    // 进行战斗
    public battle(attackerId: string, defenderId: string): {
        success: boolean;
        result?: ArenaBattle;
        error?: string;
    } {
        // 检查次数
        const remainingBattles = this.getRemainingBattles(attackerId);
        if (remainingBattles <= 0) {
            return { success: false, error: '今日挑战次数已用完' };
        }
        
        const attacker = this.rankings.find(p => p.playerId === attackerId);
        const defender = this.rankings.find(p => p.playerId === defenderId);
        
        if (!attacker || !defender) {
            return { success: false, error: '玩家不存在' };
        }
        
        // 模拟战斗结果（基于战力计算）
        const battleResult = this.simulateBattle(attacker, defender);
        
        // 更新排名
        if (battleResult.result === 'attacker_win' && attacker.rank > defender.rank) {
            this.swapRankings(attacker, defender);
        }
        
        // 记录战斗
        const battle: ArenaBattle = {
            id: `battle_${Date.now()}`,
            attacker,
            defender,
            result: battleResult.result,
            timestamp: Date.now(),
            replay: battleResult.replay
        };
        this.battles.push(battle);
        
        // 更新统计数据
        if (battleResult.result === 'attacker_win') {
            attacker.winStreak++;
            attacker.totalWins++;
            defender.winStreak = 0;
            defender.totalLosses++;
        } else {
            attacker.winStreak = 0;
            attacker.totalLosses++;
            defender.totalWins++;
        }
        
        // 消耗次数
        this.useBattleAttempt(attackerId);
        
        return { success: true, result: battle };
    }
    
    private simulateBattle(attacker: ArenaPlayer, defender: ArenaPlayer): {
        result: 'attacker_win' | 'defender_win';
        replay: BattleReplay;
    } {
        // 简单战力对比 + 随机因素
        const powerDiff = attacker.power - defender.power;
        const winChance = 0.5 + (powerDiff / (attacker.power + defender.power)) * 0.4;
        const attackerWins = Math.random() < Math.max(0.1, Math.min(0.9, winChance));
        
        // 生成简化回放
        const turns: TurnData[] = [];
        const turnCount = 5 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < turnCount; i++) {
            turns.push({
                turn: i + 1,
                action: Math.random() > 0.7 ? 'skill' : 'attack',
                actor: Math.random() > 0.5 ? 'attacker' : 'defender',
                target: Math.random() > 0.5 ? 'defender' : 'attacker',
                damage: Math.floor(Math.random() * 1000) + 500
            });
        }
        
        return {
            result: attackerWins ? 'attacker_win' : 'defender_win',
            replay: {
                turns,
                finalStats: {
                    attackerRemainingHp: attackerWins ? 30 + Math.random() * 40 : 0,
                    defenderRemainingHp: attackerWins ? 0 : 30 + Math.random() * 40,
                    turnsCount: turnCount
                }
            }
        };
    }
    
    private swapRankings(player1: ArenaPlayer, player2: ArenaPlayer): void {
        const tempRank = player1.rank;
        player1.rank = player2.rank;
        player2.rank = tempRank;
        
        // 重新排序
        this.rankings.sort((a, b) => a.rank - b.rank);
    }
    
    // 获取剩余挑战次数
    public getRemainingBattles(playerId: string): number {
        const used = this.playerDailyBattles.get(playerId) || 0;
        return Math.max(0, this.MAX_DAILY_BATTLES - used);
    }
    
    private useBattleAttempt(playerId: string): void {
        const used = this.playerDailyBattles.get(playerId) || 0;
        this.playerDailyBattles.set(playerId, used + 1);
    }
    
    // 重置每日次数
    public resetDailyBattles(): void {
        this.playerDailyBattles.clear();
    }
    
    // 获取排名奖励
    public getRankReward(rank: number): ArenaReward {
        if (rank === 1) {
            return {
                rank,
                dailyReward: { gold: 10000, soulCrystal: 200, arenaCoin: 500 },
                seasonReward: { title: '传说王者', exclusiveFrame: 'legend_frame' }
            };
        } else if (rank <= 10) {
            return {
                rank,
                dailyReward: { gold: 8000, soulCrystal: 150, arenaCoin: 400 },
                seasonReward: { title: '巅峰强者', exclusiveFrame: 'elite_frame' }
            };
        } else if (rank <= 100) {
            return {
                rank,
                dailyReward: { gold: 5000, soulCrystal: 100, arenaCoin: 300 }
            };
        } else if (rank <= 1000) {
            return {
                rank,
                dailyReward: { gold: 3000, soulCrystal: 50, arenaCoin: 200 }
            };
        } else {
            return {
                rank,
                dailyReward: { gold: 1000, soulCrystal: 20, arenaCoin: 100 }
            };
        }
    }
    
    // 设置防守阵容
    public setDefenseTeam(playerId: string, team: string[]): boolean {
        const player = this.rankings.find(p => p.playerId === playerId);
        if (!player) return false;
        
        if (team.length < 1 || team.length > 5) return false;
        
        player.defenseTeam = team;
        return true;
    }
    
    // 获取战斗历史
    public getBattleHistory(playerId: string, limit: number = 10): ArenaBattle[] {
        return this.battles
            .filter(b => b.attacker.playerId === playerId || b.defender.playerId === playerId)
            .slice(-limit)
            .reverse();
    }
}

// 单例
export const arenaSystem = new ArenaSystem();
