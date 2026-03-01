/**
 * 排行榜奖励发放器
 * 定时结算排行榜，发放奖励邮件
 */

import { LeaderboardType, RankEntry } from './LeaderboardSystem';
import { Mail, MailPriority } from '../mail/MailSystem';
import { mailSender } from '../mail/MailSender';
import { logSystem } from '../log/LogSystem';

export interface LeaderboardReward {
    rank: number;
    minRank?: number;
    maxRank?: number;
    rewards: {
        gold?: number;
        soulCrystal?: number;
        items?: { itemId: string; count: number }[];
        title?: string;
        frame?: string;
    };
}

export class LeaderboardRewardDistributor {
    private rewardConfig: Map<LeaderboardType, LeaderboardReward[]> = new Map();
    private distributionHistory: Map<string, number> = new Map();  // playerId_rankType -> lastDistributed
    
    constructor() {
        this.initializeRewardConfigs();
    }
    
    private initializeRewardConfigs(): void {
        // 战力排行榜奖励
        this.rewardConfig.set(LeaderboardType.POWER, [
            { rank: 1, rewards: { gold: 500000, soulCrystal: 5000, title: '天下第一' } },
            { rank: 2, rewards: { gold: 300000, soulCrystal: 3000 } },
            { rank: 3, rewards: { gold: 200000, soulCrystal: 2000 } },
            { minRank: 4, maxRank: 10, rewards: { gold: 100000, soulCrystal: 1000 } },
            { minRank: 11, maxRank: 50, rewards: { gold: 50000, soulCrystal: 500 } },
            { minRank: 51, maxRank: 100, rewards: { gold: 30000, soulCrystal: 300 } }
        ]);
        
        // 竞技场排行榜奖励
        this.rewardConfig.set(LeaderboardType.ARENA, [
            { rank: 1, rewards: { gold: 300000, soulCrystal: 3000, items: [{ itemId: 'arena_frame', count: 1 }] } },
            { rank: 2, rewards: { gold: 200000, soulCrystal: 2000 } },
            { rank: 3, rewards: { gold: 150000, soulCrystal: 1500 } },
            { minRank: 4, maxRank: 10, rewards: { gold: 100000, soulCrystal: 1000 } },
            { minRank: 11, maxRank: 100, rewards: { gold: 50000, soulCrystal: 500 } }
        ]);
        
        // 公会排行榜奖励
        this.rewardConfig.set(LeaderboardType.GUILD, [
            { rank: 1, rewards: { gold: 200000, soulCrystal: 2000, items: [{ itemId: 'guild_chest', count: 5 }] } },
            { rank: 2, rewards: { gold: 150000, soulCrystal: 1500, items: [{ itemId: 'guild_chest', count: 3 }] } },
            { rank: 3, rewards: { gold: 100000, soulCrystal: 1000, items: [{ itemId: 'guild_chest', count: 2 }] } }
        ]);
        
        // 爬塔排行榜奖励
        this.rewardConfig.set(LeaderboardType.TOWER, [
            { rank: 1, rewards: { gold: 150000, soulCrystal: 1500, items: [{ itemId: 'tower_chest', count: 3 }] } },
            { rank: 2, rewards: { gold: 100000, soulCrystal: 1000, items: [{ itemId: 'tower_chest', count: 2 }] } },
            { rank: 3, rewards: { gold: 80000, soulCrystal: 800, items: [{ itemId: 'tower_chest', count: 1 }] } }
        ]);
        
        // 卡牌收集排行榜
        this.rewardConfig.set(LeaderboardType.COLLECTION, [
            { rank: 1, rewards: { gold: 100000, soulCrystal: 1000, frame: 'collector_frame' } },
            { rank: 2, rewards: { gold: 80000, soulCrystal: 800 } },
            { rank: 3, rewards: { gold: 60000, soulCrystal: 600 } }
        ]);
        
        // 成就点数排行榜
        this.rewardConfig.set(LeaderboardType.ACHIEVEMENT, [
            { rank: 1, rewards: { gold: 80000, soulCrystal: 800, title: '成就大师' } },
            { rank: 2, rewards: { gold: 60000, soulCrystal: 600 } },
            { rank: 3, rewards: { gold: 40000, soulCrystal: 400 } }
        ]);
        
        // 关卡进度排行榜
        this.rewardConfig.set(LeaderboardType.LEVEL, [
            { rank: 1, rewards: { gold: 60000, soulCrystal: 600 } },
            { rank: 2, rewards: { gold: 40000, soulCrystal: 400 } },
            { rank: 3, rewards: { gold: 30000, soulCrystal: 300 } }
        ]);
        
        // 无尽试炼排行榜
        this.rewardConfig.set(LeaderboardType.ENDLESS, [
            { rank: 1, rewards: { gold: 100000, soulCrystal: 1000, items: [{ itemId: 'endless_chest', count: 3 }] } },
            { rank: 2, rewards: { gold: 70000, soulCrystal: 700, items: [{ itemId: 'endless_chest', count: 2 }] } },
            { rank: 3, rewards: { gold: 50000, soulCrystal: 500, items: [{ itemId: 'endless_chest', count: 1 }] } }
        ]);
    }
    
    /**
     * 发放排行榜奖励
     * 在排行榜结算时调用
     */
    public distributeRewards(
        type: LeaderboardType,
        rankings: RankEntry[],
        season?: string
    ): { distributed: number; errors: string[] } {
        const rewards = this.rewardConfig.get(type);
        if (!rewards) {
            return { distributed: 0, errors: ['未找到奖励配置'] };
        }
        
        const errors: string[] = [];
        let distributed = 0;
        
        rankings.forEach(entry => {
            try {
                const reward = this.getRewardForRank(rewards, entry.rank);
                if (!reward) return;
                
                // 使用邮件发送器发送奖励
                const mailId = mailSender.sendLeaderboardReward(
                    entry.playerId,
                    this.getLeaderboardTypeName(type),
                    entry.rank,
                    reward.rewards
                );
                
                logSystem.info('LeaderboardReward', `Reward sent`, {
                    playerId: entry.playerId,
                    type,
                    rank: entry.rank,
                    mailId
                });
                
                distributed++;
                
                // 记录发放历史
                this.markDistributed(entry.playerId, type);
            } catch (error) {
                errors.push(`Failed to send to ${entry.playerId}: ${error}`);
                logSystem.error('LeaderboardReward', `Failed to send reward`, {
                    playerId: entry.playerId,
                    error
                });
            }
        });
        
        return { distributed, errors };
    }
    
    /**
     * 获取指定排名的奖励
     */
    private getRewardForRank(
        rewards: LeaderboardReward[],
        rank: number
    ): LeaderboardReward | null {
        for (const reward of rewards) {
            // 精确匹配
            if (reward.rank === rank) {
                return reward;
            }
            // 范围匹配
            if (reward.minRank && reward.maxRank) {
                if (rank >= reward.minRank && rank <= reward.maxRank) {
                    return reward;
                }
            }
        }
        return null;
    }
    
    /**
     * 创建奖励邮件
     */
    private createRewardMail(
        type: LeaderboardType,
        rank: number,
        reward: LeaderboardReward,
        season?: string
    ): Mail {
        const typeNames: Record<LeaderboardType, string> = {
            [LeaderboardType.POWER]: '战力榜',
            [LeaderboardType.ARENA]: '竞技场',
            [LeaderboardType.GUILD]: '公会榜',
            [LeaderboardType.TOWER]: '爬塔榜',
            [LeaderboardType.COLLECTION]: '收集榜',
            [LeaderboardType.ACHIEVEMENT]: '成就榜',
            [LeaderboardType.LEVEL]: '关卡榜',
            [LeaderboardType.ENDLESS]: '无尽试炼'
        };
        
        const rankText = rank <= 3 
            ? ['🥇 冠军', '🥈 亚军', '🥉 季军'][rank - 1]
            : `第 ${rank} 名`;
        
        const seasonText = season ? `（${season}赛季）` : '';
        
        let content = `恭喜您在${typeNames[type]}${seasonText}中获得 ${rankText}！\n\n`;
        content += '奖励内容：\n';
        
        if (reward.rewards.gold) {
            content += `💰 金币 × ${reward.rewards.gold.toLocaleString()}\n`;
        }
        if (reward.rewards.soulCrystal) {
            content += `💎 魂晶 × ${reward.rewards.soulCrystal.toLocaleString()}\n`;
        }
        if (reward.rewards.items) {
            reward.rewards.items.forEach(item => {
                content += `📦 ${item.itemId} × ${item.count}\n`;
            });
        }
        if (reward.rewards.title) {
            content += `🏆 称号：${reward.rewards.title}\n`;
        }
        if (reward.rewards.frame) {
            content += `🖼️ 头像框：${reward.rewards.frame}\n`;
        }
        
        content += '\n感谢您的参与，祝您游戏愉快！';
        
        return {
            id: `LBR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            senderId: 'system',
            senderName: '系统',
            recipientId: '',  // 会在发送时填充
            title: `${typeNames[type]} ${rankText} 奖励`,
            content,
            attachments: {
                gold: reward.rewards.gold,
                soulCrystal: reward.rewards.soulCrystal,
                items: reward.rewards.items
            },
            priority: rank <= 3 ? MailPriority.HIGH : MailPriority.NORMAL,
            isRead: false,
            isClaimed: false,
            createdAt: Date.now(),
            expireAt: Date.now() + 30 * 24 * 60 * 60 * 1000  // 30天过期
        };
    }
    
    /**
     * 检查是否已发放过奖励
     */
    public hasDistributed(playerId: string, type: LeaderboardType): boolean {
        const key = `${playerId}_${type}`;
        const lastDistributed = this.distributionHistory.get(key);
        if (!lastDistributed) return false;
        
        // 检查是否为本周期（简单实现：24小时内）
        const oneDay = 24 * 60 * 60 * 1000;
        return Date.now() - lastDistributed < oneDay;
    }
    
    private markDistributed(playerId: string, type: LeaderboardType): void {
        const key = `${playerId}_${type}`;
        this.distributionHistory.set(key, Date.now());
    }
    
    /**
     * 获取排行榜类型名称
     */
    private getLeaderboardTypeName(type: LeaderboardType): string {
        const typeNames: Record<LeaderboardType, string> = {
            [LeaderboardType.POWER]: '战力榜',
            [LeaderboardType.ARENA]: '竞技场',
            [LeaderboardType.GUILD]: '公会榜',
            [LeaderboardType.TOWER]: '爬塔榜',
            [LeaderboardType.COLLECTION]: '收集榜',
            [LeaderboardType.ACHIEVEMENT]: '成就榜',
            [LeaderboardType.LEVEL]: '关卡榜',
            [LeaderboardType.ENDLESS]: '无尽试炼'
        };
        return typeNames[type] || '排行榜';
    }
    
    /**
     * 手动发放特定排名奖励（用于补偿等）
     */
    public manualGrantReward(
        playerId: string,
        type: LeaderboardType,
        rank: number,
        reason: string
    ): { success: boolean; error?: string } {
        const rewards = this.rewardConfig.get(type);
        if (!rewards) {
            return { success: false, error: '未找到奖励配置' };
        }
        
        const reward = this.getRewardForRank(rewards, rank);
        if (!reward) {
            return { success: false, error: '未找到该排名奖励' };
        }
        
        // 使用邮件发送器发送补偿
        const mailId = mailSender.sendCompensation(
            playerId,
            reason,
            reward.rewards
        );
        
        logSystem.info('LeaderboardReward', `Manual compensation sent`, {
            playerId,
            type,
            rank,
            reason,
            mailId
        });
        
        return { success: true };
    }
    
    /**
     * 获取奖励配置
     */
    public getRewardConfig(type: LeaderboardType): LeaderboardReward[] {
        return this.rewardConfig.get(type) || [];
    }
    
    /**
     * 预览指定排名的奖励
     */
    public previewReward(type: LeaderboardType, rank: number): LeaderboardReward | null {
        const rewards = this.rewardConfig.get(type);
        if (!rewards) return null;
        return this.getRewardForRank(rewards, rank);
    }
}

// 单例
export const leaderboardRewardDistributor = new LeaderboardRewardDistributor();
