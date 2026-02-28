/**
 * 世界BOSS系统
 * 全服共同挑战的强力BOSS
 */

export interface WorldBoss {
    id: string;
    name: string;
    description: string;
    level: number;
    
    // 外观
    appearance: {
        image: string;
        model?: string;
        animation: string;
    };
    
    // 战斗属性
    maxHp: number;
    currentHp: number;
    attack: number;
    defense: number;
    
    // 技能
    skills: WorldBossSkill[];
    
    // 时间
    startTime: number;
    endTime: number;
    
    // 状态
    status: 'upcoming' | 'active' | 'defeated' | 'ended';
}

export interface WorldBossSkill {
    id: string;
    name: string;
    description: string;
    damagePercent: number;  // 对玩家最大生命的百分比伤害
    effect?: string;
    cooldown: number;       // 回合数
}

export interface WorldBossBattle {
    playerId: string;
    bossId: string;
    damageDealt: number;
    battleTime: number;
    timestamp: number;
    isKillingBlow: boolean;
}

export interface WorldBossReward {
    rank: number;
    minDamage: number;
    rewards: {
        gold: number;
        soulCrystal: number;
        items?: { itemId: string; count: number }[];
        specialCard?: string;
    };
}

export class WorldBossSystem {
    private bosses: Map<string, WorldBoss> = new Map();
    private battleRecords: Map<string, WorldBossBattle[]> = new Map();  // bossId -> records
    private playerDamage: Map<string, Map<string, number>> = new Map();  // bossId -> (playerId -> damage)
    private rewardTiers: WorldBossReward[] = [];
    
    constructor() {
        this.initializeRewardTiers();
    }
    
    private initializeRewardTiers(): void {
        this.rewardTiers = [
            { rank: 1, minDamage: 10000000, rewards: { gold: 1000000, soulCrystal: 5000, specialCard: 'world_boss_legend' } },
            { rank: 2, minDamage: 5000000, rewards: { gold: 500000, soulCrystal: 3000 } },
            { rank: 3, minDamage: 3000000, rewards: { gold: 300000, soulCrystal: 2000 } },
            { rank: 10, minDamage: 1000000, rewards: { gold: 200000, soulCrystal: 1500 } },
            { rank: 50, minDamage: 500000, rewards: { gold: 100000, soulCrystal: 1000 } },
            { rank: 100, minDamage: 100000, rewards: { gold: 50000, soulCrystal: 500 } },
            { rank: 999999, minDamage: 0, rewards: { gold: 10000, soulCrystal: 100 } }  // 参与奖
        ];
    }
    
    // 创建世界BOSS
    public createBoss(
        id: string,
        name: string,
        description: string,
        maxHp: number,
        duration: number  // 持续时间（小时）
    ): WorldBoss {
        const now = Date.now();
        const boss: WorldBoss = {
            id,
            name,
            description,
            level: 100,
            appearance: {
                image: `bosses/${id}.bmp`,
                animation: `bosses/${id}_anim`
            },
            maxHp,
            currentHp: maxHp,
            attack: 5000,
            defense: 2000,
            skills: [
                { id: 'skill_1', name: '毁灭打击', description: '对单体造成巨大伤害', damagePercent: 50, cooldown: 3 },
                { id: 'skill_2', name: '地震波', description: '对全体造成伤害', damagePercent: 30, cooldown: 5 },
                { id: 'skill_3', name: '狂暴', description: '攻击力提升', effect: 'atk_up', cooldown: 8 }
            ],
            startTime: now,
            endTime: now + duration * 60 * 60 * 1000,
            status: 'active'
        };
        
        this.bosses.set(id, boss);
        this.battleRecords.set(id, []);
        this.playerDamage.set(id, new Map());
        
        return boss;
    }
    
    // 挑战世界BOSS
    public challengeBoss(
        playerId: string,
        bossId: string,
        playerPower: number
    ): {
        success: boolean;
        result?: {
            damage: number;
            isCritical: boolean;
            isKillingBlow: boolean;
            bossRemainingHp: number;
        };
        error?: string;
    } {
        const boss = this.bosses.get(bossId);
        if (!boss) return { success: false, error: 'BOSS不存在' };
        
        if (boss.status !== 'active') {
            return { success: false, error: 'BOSS挑战已结束' };
        }
        
        // 计算伤害（简化公式）
        const baseDamage = playerPower * 10;
        const randomFactor = 0.8 + Math.random() * 0.4;  // 0.8-1.2
        const critical = Math.random() < 0.1;  // 10%暴击
        const criticalMultiplier = critical ? 2 : 1;
        
        const damage = Math.floor(baseDamage * randomFactor * criticalMultiplier);
        
        // 更新BOSS血量
        boss.currentHp = Math.max(0, boss.currentHp - damage);
        
        // 记录伤害
        const isKillingBlow = boss.currentHp === 0;
        if (isKillingBlow) {
            boss.status = 'defeated';
        }
        
        // 记录战斗
        const battle: WorldBossBattle = {
            playerId,
            bossId,
            damageDealt: damage,
            battleTime: Date.now(),
            timestamp: Date.now(),
            isKillingBlow
        };
        
        this.battleRecords.get(bossId)!.push(battle);
        
        // 累加玩家伤害
        const damageMap = this.playerDamage.get(bossId)!;
        damageMap.set(playerId, (damageMap.get(playerId) || 0) + damage);
        
        return {
            success: true,
            result: {
                damage,
                isCritical: critical,
                isKillingBlow,
                bossRemainingHp: boss.currentHp
            }
        };
    }
    
    // 获取BOSS状态
    public getBossStatus(bossId: string): {
        boss: WorldBoss | null;
        progress: number;
        totalDamage: number;
        participantCount: number;
    } | null {
        const boss = this.bosses.get(bossId);
        if (!boss) return null;
        
        const damageMap = this.playerDamage.get(bossId);
        const totalDamage = damageMap 
            ? Array.from(damageMap.values()).reduce((a, b) => a + b, 0)
            : 0;
        
        return {
            boss,
            progress: ((boss.maxHp - boss.currentHp) / boss.maxHp) * 100,
            totalDamage,
            participantCount: damageMap?.size || 0
        };
    }
    
    // 获取玩家排名
    public getPlayerRank(bossId: string, playerId: string): {
        rank: number;
        damage: number;
        percentage: number;
    } | null {
        const damageMap = this.playerDamage.get(bossId);
        if (!damageMap) return null;
        
        const damage = damageMap.get(playerId);
        if (!damage) return null;
        
        // 排序获取排名
        const sorted = Array.from(damageMap.entries())
            .sort((a, b) => b[1] - a[1]);
        
        const rank = sorted.findIndex(([id]) => id === playerId) + 1;
        
        return {
            rank,
            damage,
            percentage: (damage / sorted[0][1]) * 100
        };
    }
    
    // 获取排行榜
    public getLeaderboard(bossId: string, limit: number = 50): {
        rank: number;
        playerId: string;
        damage: number;
        percentage: number;
    }[] {
        const damageMap = this.playerDamage.get(bossId);
        if (!damageMap) return [];
        
        const sorted = Array.from(damageMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
        
        const maxDamage = sorted[0]?.[1] || 1;
        
        return sorted.map(([playerId, damage], index) => ({
            rank: index + 1,
            playerId,
            damage,
            percentage: (damage / maxDamage) * 100
        }));
    }
    
    // 计算并发放奖励
    public distributeRewards(bossId: string): void {
        const boss = this.bosses.get(bossId);
        if (!boss) return;
        
        const damageMap = this.playerDamage.get(bossId);
        if (!damageMap) return;
        
        // 排序所有参与者
        const sorted = Array.from(damageMap.entries())
            .sort((a, b) => b[1] - a[1]);
        
        // 按排名发放奖励
        sorted.forEach(([playerId, damage], index) => {
            const rank = index + 1;
            const rewardTier = this.rewardTiers.find(t => rank <= t.rank);
            
            if (rewardTier && damage >= rewardTier.minDamage) {
                // TODO: 发送奖励邮件
                console.log(`发放世界BOSS奖励: ${playerId}, 排名: ${rank}, 伤害: ${damage}`);
            }
        });
        
        boss.status = 'ended';
    }
    
    // 获取进行中的BOSS
    public getActiveBosses(): WorldBoss[] {
        return Array.from(this.bosses.values())
            .filter(b => b.status === 'active');
    }
    
    // 定时检查BOSS状态
    public checkBossStatus(): void {
        const now = Date.now();
        
        this.bosses.forEach(boss => {
            if (boss.status === 'active' && now > boss.endTime) {
                // 时间到，结算奖励
                this.distributeRewards(boss.id);
            }
        });
    }
}

// 单例
export const worldBossSystem = new WorldBossSystem();
