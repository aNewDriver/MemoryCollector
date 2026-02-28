/**
 * 公会系统
 * 玩家社交、协作玩法
 */

export interface Guild {
    id: string;
    name: string;
    level: number;
    exp: number;
    
    // 成员
    members: GuildMember[];
    maxMembers: number;
    
    // 公告
    announcement: string;
    
    // 建筑等级
    buildings: {
        hall: number;      // 公会大厅
        shop: number;      // 公会商店
        research: number;  // 研究所
        barracks: number;  // 训练营
    };
    
    // 资源
    resources: {
        contribution: number;  // 公会贡献度
        funds: number;         // 公会资金
    };
    
    // 排行榜
    ranking: {
        weeklyContribution: number;
        totalPower: number;
    };
}

export interface GuildMember {
    playerId: string;
    name: string;
    position: GuildPosition;
    contribution: number;  // 个人贡献度
    weeklyContribution: number;
    joinTime: number;
    lastLogin: number;
}

export enum GuildPosition {
    LEADER = 'leader',      // 会长
    VICE = 'vice',          // 副会长
    ELITE = 'elite',        // 精英
    MEMBER = 'member'       // 普通成员
}

// 公会任务
export interface GuildQuest {
    id: string;
    name: string;
    description: string;
    target: {
        type: 'donate' | 'battle' | 'boss' | 'share';
        count: number;
    };
    reward: {
        personalContribution: number;
        guildFunds: number;
    };
    progress: number;
    completed: boolean;
}

// 公会科技
export interface GuildTech {
    id: string;
    name: string;
    description: string;
    maxLevel: number;
    currentLevel: number;
    effects: { stat: string; value: number }[];
    upgradeCost: {
        contribution: number;
        funds: number;
    };
}

// 公会战
export interface GuildWar {
    id: string;
    attackerGuildId: string;
    defenderGuildId: string;
    status: 'preparation' | 'ongoing' | 'ended';
    startTime: number;
    endTime: number;
    
    // 战斗数据
    battles: GuildBattle[];
    
    // 结果
    result?: {
        winner: string;
        attackerScore: number;
        defenderScore: number;
    };
}

export interface GuildBattle {
    attacker: { playerId: string; name: string };
    defender: { playerId: string; name: string };
    result: 'attacker_win' | 'defender_win' | 'draw';
    timestamp: number;
}

// 公会BOSS
export interface GuildBoss {
    id: string;
    name: string;
    level: number;
    maxHp: number;
    currentHp: number;
    
    // 战斗状态
    isActive: boolean;
    startTime: number;
    endTime: number;
    
    // 伤害排行
    damageRanking: { playerId: string; name: string; damage: number }[];
    
    // 奖励
    rewards: {
        participation: { itemId: string; count: number };
        ranking: { rank: number; reward: any }[];
        lastHit: { itemId: string; count: number };
    };
}

export class GuildSystem {
    private guilds: Map<string, Guild> = new Map();
    private playerGuild: Map<string, string> = new Map();  // playerId -> guildId
    private guildWars: Map<string, GuildWar> = new Map();
    private guildBosses: Map<string, GuildBoss> = new Map();
    
    // 创建公会
    public createGuild(playerId: string, name: string): { success: boolean; guild?: Guild; error?: string } {
        // 检查是否已有公会
        if (this.playerGuild.has(playerId)) {
            return { success: false, error: '已有公会' };
        }
        
        // 检查名称
        if (name.length < 2 || name.length > 20) {
            return { success: false, error: '公会名称长度2-20字符' };
        }
        
        const guild: Guild = {
            id: `guild_${Date.now()}`,
            name,
            level: 1,
            exp: 0,
            members: [{
                playerId,
                name: 'Player',  // TODO: 获取玩家名
                position: GuildPosition.LEADER,
                contribution: 0,
                weeklyContribution: 0,
                joinTime: Date.now(),
                lastLogin: Date.now()
            }],
            maxMembers: 20,
            announcement: '欢迎加入公会！',
            buildings: {
                hall: 1,
                shop: 1,
                research: 1,
                barracks: 1
            },
            resources: {
                contribution: 0,
                funds: 1000
            },
            ranking: {
                weeklyContribution: 0,
                totalPower: 0
            }
        };
        
        this.guilds.set(guild.id, guild);
        this.playerGuild.set(playerId, guild.id);
        
        return { success: true, guild };
    }
    
    // 加入公会
    public joinGuild(playerId: string, guildId: string): { success: boolean; error?: string } {
        if (this.playerGuild.has(playerId)) {
            return { success: false, error: '已有公会' };
        }
        
        const guild = this.guilds.get(guildId);
        if (!guild) {
            return { success: false, error: '公会不存在' };
        }
        
        if (guild.members.length >= guild.maxMembers) {
            return { success: false, error: '公会已满' };
        }
        
        guild.members.push({
            playerId,
            name: 'Player',
            position: GuildPosition.MEMBER,
            contribution: 0,
            weeklyContribution: 0,
            joinTime: Date.now(),
            lastLogin: Date.now()
        });
        
        this.playerGuild.set(playerId, guildId);
        return { success: true };
    }
    
    // 捐献
    public donate(playerId: string, type: 'gold' | 'crystal', amount: number): { success: boolean; contribution?: number; error?: string } {
        const guildId = this.playerGuild.get(playerId);
        if (!guildId) {
            return { success: false, error: '没有公会' };
        }
        
        const guild = this.guilds.get(guildId)!;
        const member = guild.members.find(m => m.playerId === playerId);
        if (!member) {
            return { success: false, error: '不是公会成员' };
        }
        
        // 计算贡献度
        const contributionRate = type === 'gold' ? 0.1 : 10;
        const contribution = Math.floor(amount * contributionRate);
        
        member.contribution += contribution;
        member.weeklyContribution += contribution;
        guild.resources.contribution += contribution;
        
        if (type === 'gold') {
            guild.resources.funds += amount;
        }
        
        // 检查公会升级
        this.checkGuildLevelUp(guild);
        
        return { success: true, contribution };
    }
    
    private checkGuildLevelUp(guild: Guild): void {
        const expNeeded = guild.level * 10000;
        if (guild.resources.contribution >= expNeeded) {
            guild.level++;
            guild.maxMembers += 5;
            // 升级建筑上限
            console.log(`公会 ${guild.name} 升级到 ${guild.level} 级！`);
        }
    }
    
    // 升级建筑
    public upgradeBuilding(playerId: string, building: keyof Guild['buildings']): { success: boolean; error?: string } {
        const guildId = this.playerGuild.get(playerId);
        if (!guildId) return { success: false, error: '没有公会' };
        
        const guild = this.guilds.get(guildId)!;
        const member = guild.members.find(m => m.playerId === playerId);
        if (!member || (member.position !== GuildPosition.LEADER && member.position !== GuildPosition.VICE)) {
            return { success: false, error: '权限不足' };
        }
        
        const currentLevel = guild.buildings[building];
        const cost = currentLevel * 5000;
        
        if (guild.resources.funds < cost) {
            return { success: false, error: '公会资金不足' };
        }
        
        guild.resources.funds -= cost;
        guild.buildings[building]++;
        
        return { success: true };
    }
    
    // 获取公会列表
    public getGuildList(): Guild[] {
        return Array.from(this.guilds.values())
            .sort((a, b) => b.ranking.totalPower - a.ranking.totalPower);
    }
    
    // 获取我的公会
    public getMyGuild(playerId: string): Guild | null {
        const guildId = this.playerGuild.get(playerId);
        if (!guildId) return null;
        return this.guilds.get(guildId) || null;
    }
    
    // 退出公会
    public leaveGuild(playerId: string): { success: boolean; error?: string } {
        const guildId = this.playerGuild.get(playerId);
        if (!guildId) return { success: false, error: '没有公会' };
        
        const guild = this.guilds.get(guildId)!;
        const memberIndex = guild.members.findIndex(m => m.playerId === playerId);
        
        if (memberIndex === -1) return { success: false, error: '不是成员' };
        
        const member = guild.members[memberIndex];
        
        // 会长不能退出，需要转让
        if (member.position === GuildPosition.LEADER) {
            return { success: false, error: '会长需要转让职位才能退出' };
        }
        
        guild.members.splice(memberIndex, 1);
        this.playerGuild.delete(playerId);
        
        return { success: true };
    }
    
    // ===== 公会BOSS =====
    
    public startGuildBoss(guildId: string): { success: boolean; boss?: GuildBoss; error?: string } {
        const guild = this.guilds.get(guildId);
        if (!guild) return { success: false, error: '公会不存在' };
        
        // 检查是否已有活跃的BOSS
        const existingBoss = this.guildBosses.get(guildId);
        if (existingBoss?.isActive) {
            return { success: false, error: '公会BOSS正在挑战中' };
        }
        
        // 消耗公会资金开启
        const cost = 5000;
        if (guild.resources.funds < cost) {
            return { success: false, error: '公会资金不足' };
        }
        
        guild.resources.funds -= cost;
        
        const boss: GuildBoss = {
            id: `boss_${guildId}_${Date.now()}`,
            name: '公会守护者',
            level: guild.level * 10,
            maxHp: 1000000 * guild.level,
            currentHp: 1000000 * guild.level,
            isActive: true,
            startTime: Date.now(),
            endTime: Date.now() + 24 * 60 * 60 * 1000,  // 24小时
            damageRanking: [],
            rewards: {
                participation: { itemId: 'guild_coin', count: 50 },
                ranking: [
                    { rank: 1, reward: { itemId: 'guild_coin', count: 500 } },
                    { rank: 2, reward: { itemId: 'guild_coin', count: 300 } },
                    { rank: 3, reward: { itemId: 'guild_coin', count: 200 } }
                ],
                lastHit: { itemId: 'guild_coin', count: 100 }
            }
        };
        
        this.guildBosses.set(guildId, boss);
        return { success: true, boss };
    }
    
    // 挑战公会BOSS
    public attackGuildBoss(playerId: string, damage: number): { success: boolean; result?: any; error?: string } {
        const guildId = this.playerGuild.get(playerId);
        if (!guildId) return { success: false, error: '没有公会' };
        
        const boss = this.guildBosses.get(guildId);
        if (!boss || !boss.isActive) {
            return { success: false, error: '没有活跃的公会BOSS' };
        }
        
        boss.currentHp -= damage;
        
        // 更新伤害排行
        const existingEntry = boss.damageRanking.find(r => r.playerId === playerId);
        if (existingEntry) {
            existingEntry.damage += damage;
        } else {
            boss.damageRanking.push({ playerId, name: 'Player', damage });
        }
        
        // 排序
        boss.damageRanking.sort((a, b) => b.damage - a.damage);
        
        // 检查是否击败
        let isLastHit = false;
        if (boss.currentHp <= 0) {
            boss.currentHp = 0;
            boss.isActive = false;
            isLastHit = true;
            
            // 发放奖励
            this.distributeBossRewards(guildId, boss);
        }
        
        return { 
            success: true, 
            result: { 
                damage, 
                remainingHp: boss.currentHp,
                ranking: boss.damageRanking.findIndex(r => r.playerId === playerId) + 1,
                isLastHit
            } 
        };
    }
    
    private distributeBossRewards(guildId: string, boss: GuildBoss): void {
        // TODO: 实现奖励发放逻辑
        console.log(`公会BOSS被击败，发放奖励`);
    }
}

// 单例
export const guildSystem = new GuildSystem();
