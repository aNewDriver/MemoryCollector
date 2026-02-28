/**
 * 无尽试炼系统
 * 高难度挑战，检验玩家实力
 */

export interface TrialData {
    id: number;
    name: string;
    description: string;
    difficulty: number;  // 1-10
    
    // 限制条件
    restrictions: TrialRestriction[];
    
    // 敌人配置
    enemies: TrialEnemy[];
    
    // 奖励
    rewards: TrialReward;
    
    // 通关记录
    clearRecord?: {
        playerName: string;
        clearTime: number;  // 秒
        timestamp: number;
    };
}

export interface TrialRestriction {
    type: 'element' | 'rarity' | 'level' | 'card_count';
    value: any;
    description: string;
}

export interface TrialEnemy {
    enemyId: string;
    level: number;
    enhancedStats: {  // 强化属性
        hpMultiplier: number;
        atkMultiplier: number;
        defMultiplier: number;
    };
    specialAbilities: string[];
}

export interface TrialReward {
    firstClear: {
        soulCrystal: number;
        specialCard?: string;
        exclusiveEquipment?: string;
    };
    dailyClear: {
        gold: number;
        materials: { id: string; count: number }[];
    };
}

// 试炼关卡数据
export const TRIALS: TrialData[] = [
    {
        id: 1,
        name: '火焰试炼',
        description: '只能使用火属性卡牌，面对水属性敌人的挑战',
        difficulty: 3,
        restrictions: [
            { type: 'element', value: 'fire', description: '只能使用火属性卡牌' }
        ],
        enemies: [
            {
                enemyId: 'water_golem',
                level: 50,
                enhancedStats: { hpMultiplier: 2, atkMultiplier: 1.5, defMultiplier: 1.2 },
                specialAbilities: ['water_shield', 'frost_nova']
            }
        ],
        rewards: {
            firstClear: {
                soulCrystal: 1000,
                specialCard: 'lie_yan_fragment'
            },
            dailyClear: {
                gold: 5000,
                materials: [{ id: 'fire_essence', count: 10 }]
            }
        }
    },
    {
        id: 2,
        name: '生存试炼',
        description: '在没有治疗的情况下存活20回合',
        difficulty: 5,
        restrictions: [
            { type: 'card_count', value: 3, description: '只能上阵3名角色' }
        ],
        enemies: [
            {
                enemyId: 'endless_horde',
                level: 60,
                enhancedStats: { hpMultiplier: 0.5, atkMultiplier: 1, defMultiplier: 0.8 },
                specialAbilities: ['swarm', 'endless_spawn']
            }
        ],
        rewards: {
            firstClear: {
                soulCrystal: 1500,
                exclusiveEquipment: 'survivor_ring'
            },
            dailyClear: {
                gold: 8000,
                materials: [{ id: 'survivor_badge', count: 5 }]
            }
        }
    },
    {
        id: 3,
        name: '极限挑战',
        description: '使用仅限普通和稀有卡牌，击败传说级敌人',
        difficulty: 7,
        restrictions: [
            { type: 'rarity', value: [1, 2], description: '只能使用普通和稀有卡牌' }
        ],
        enemies: [
            {
                enemyId: 'fallen_legend',
                level: 80,
                enhancedStats: { hpMultiplier: 3, atkMultiplier: 2, defMultiplier: 1.5 },
                specialAbilities: ['legendary_aura', 'ultimate_skill', 'second_life']
            }
        ],
        rewards: {
            firstClear: {
                soulCrystal: 3000,
                specialCard: 'random_legend'
            },
            dailyClear: {
                gold: 15000,
                materials: [{ id: 'challenge_token', count: 10 }]
            }
        }
    },
    {
        id: 4,
        name: '时间试炼',
        description: '在10回合内击败所有敌人',
        difficulty: 8,
        restrictions: [
            { type: 'level', value: 60, description: '角色等级不可超过60级' }
        ],
        enemies: [
            {
                enemyId: 'time_guardian',
                level: 70,
                enhancedStats: { hpMultiplier: 2.5, atkMultiplier: 1.8, defMultiplier: 1.3 },
                specialAbilities: ['time_stop', 'haste', 'turn_limit']
            }
        ],
        rewards: {
            firstClear: {
                soulCrystal: 5000,
                exclusiveEquipment: 'time_amulet'
            },
            dailyClear: {
                gold: 20000,
                materials: [{ id: 'time_shard', count: 5 }]
            }
        }
    },
    {
        id: 5,
        name: '终极试炼',
        description: '面对完全体的记忆之主，只有最强的回收者才能通过',
        difficulty: 10,
        restrictions: [],
        enemies: [
            {
                enemyId: 'memory_lord_true',
                level: 100,
                enhancedStats: { hpMultiplier: 5, atkMultiplier: 3, defMultiplier: 2 },
                specialAbilities: ['memory_steal', 'reality_warp', 'phase_shift', 'ultimate_void']
            }
        ],
        rewards: {
            firstClear: {
                soulCrystal: 10000,
                specialCard: 'can_ying_awaken_material',
                exclusiveEquipment: 'memory_crown'
            },
            dailyClear: {
                gold: 50000,
                materials: [
                    { id: 'supreme_memory', count: 1 },
                    { id: 'void_essence', count: 5 }
                ]
            }
        }
    }
];

export class TrialSystem {
    private clearedTrials: Set<number> = new Set();
    private dailyClearCount: Map<number, number> = new Map();
    
    // 获取试炼列表
    public getTrials(): TrialData[] {
        return TRIALS;
    }
    
    // 检查是否已通过
    public isCleared(trialId: number): boolean {
        return this.clearedTrials.has(trialId);
    }
    
    // 记录通关
    public recordClear(trialId: number, clearTime: number): void {
        this.clearedTrials.add(trialId);
        
        const trial = TRIALS.find(t => t.id === trialId);
        if (trial) {
            // 更新最快记录
            if (!trial.clearRecord || clearTime < trial.clearRecord.clearTime) {
                trial.clearRecord = {
                    playerName: 'Player',  // TODO: 获取玩家名
                    clearTime,
                    timestamp: Date.now()
                };
            }
        }
    }
    
    // 检查是否可以挑战
    public canChallenge(trialId: number, playerCards: any[]): { can: boolean; reason?: string } {
        const trial = TRIALS.find(t => t.id === trialId);
        if (!trial) return { can: false, reason: '试炼不存在' };
        
        // 检查前置条件
        if (trialId > 1 && !this.isCleared(trialId - 1)) {
            return { can: false, reason: '需要先通过前一个试炼' };
        }
        
        // 检查限制条件
        for (const restriction of trial.restrictions) {
            const check = this.checkRestriction(restriction, playerCards);
            if (!check.pass) {
                return { can: false, reason: check.reason };
            }
        }
        
        return { can: true };
    }
    
    private checkRestriction(restriction: TrialRestriction, cards: any[]): { pass: boolean; reason?: string } {
        switch (restriction.type) {
            case 'element':
                const hasElement = cards.some(c => c.element === restriction.value);
                if (!hasElement) return { pass: false, reason: `需要至少1名${restriction.value}属性角色` };
                const allSameElement = cards.every(c => c.element === restriction.value);
                if (!allSameElement) return { pass: false, reason: `所有角色必须是${restriction.value}属性` };
                return { pass: true };
                
            case 'rarity':
                const allowedRarities = restriction.value as number[];
                const validRarity = cards.every(c => allowedRarities.includes(c.rarity));
                if (!validRarity) return { pass: false, reason: restriction.description };
                return { pass: true };
                
            case 'level':
                const maxLevel = restriction.value as number;
                const validLevel = cards.every(c => c.level <= maxLevel);
                if (!validLevel) return { pass: false, reason: `角色等级不可超过${maxLevel}级` };
                return { pass: true };
                
            case 'card_count':
                const maxCount = restriction.value as number;
                if (cards.length > maxCount) return { pass: false, reason: `最多只能上阵${maxCount}名角色` };
                return { pass: true };
                
            default:
                return { pass: true };
        }
    }
    
    // 获取每日奖励
    public claimDailyReward(trialId: number): { success: boolean; reward?: any } {
        const todayCount = this.dailyClearCount.get(trialId) || 0;
        if (todayCount >= 1) {
            return { success: false };  // 每日只能领取一次
        }
        
        const trial = TRIALS.find(t => t.id === trialId);
        if (!trial || !this.isCleared(trialId)) {
            return { success: false };
        }
        
        this.dailyClearCount.set(trialId, todayCount + 1);
        return { success: true, reward: trial.rewards.dailyClear };
    }
    
    // 重置每日次数
    public resetDailyCount(): void {
        this.dailyClearCount.clear();
    }
}

// 单例
export const trialSystem = new TrialSystem();
