/**
 * 世界BOSS奖励发放器
 * 结算世界BOSS战斗，发放参与奖励和排名奖励
 */

import { Mail, MailPriority } from '../mail/MailSystem';
import { mailSender } from '../mail/MailSender';
import { logSystem } from '../log/LogSystem';

export interface WorldBossParticipationReward {
    minDamage: number;
    rewards: {
        gold: number;
        soulCrystal: number;
        contribution?: number;
        items?: { itemId: string; count: number }[];
    };
}

export interface WorldBossRankReward {
    rank: number;
    minDamage: number;
    rewards: {
        gold: number;
        soulCrystal: number;
        contribution: number;
        items: { itemId: string; count: number }[];
        specialCard?: string;
        title?: string;
    };
}

export interface WorldBossKillReward {
    killerRewards: {
        gold: number;
        soulCrystal: number;
        items: { itemId: string; count: number }[];
        title: string;
        specialFrame: string;
    };
}

export class WorldBossRewardDistributor {
    // 参与奖（只要造成伤害就有）
    private participationTiers: WorldBossParticipationReward[] = [
        { minDamage: 1000000, rewards: { gold: 100000, soulCrystal: 1000, contribution: 1000 } },
        { minDamage: 500000, rewards: { gold: 80000, soulCrystal: 800, contribution: 800 } },
        { minDamage: 100000, rewards: { gold: 60000, soulCrystal: 600, contribution: 600 } },
        { minDamage: 10000, rewards: { gold: 40000, soulCrystal: 400, contribution: 400 } },
        { minDamage: 1, rewards: { gold: 20000, soulCrystal: 200, contribution: 200 } }
    ];
    
    // 排名奖励
    private rankTiers: WorldBossRankReward[] = [
        {
            rank: 1,
            minDamage: 10000000,
            rewards: {
                gold: 500000,
                soulCrystal: 5000,
                contribution: 5000,
                items: [
                    { itemId: 'boss_chest_legendary', count: 3 },
                    { itemId: 'equipment_box_gold', count: 5 }
                ],
                specialCard: 'world_boss_slayer',
                title: '世界BOSS终结者'
            }
        },
        {
            rank: 2,
            minDamage: 5000000,
            rewards: {
                gold: 300000,
                soulCrystal: 3000,
                contribution: 3000,
                items: [
                    { itemId: 'boss_chest_legendary', count: 2 },
                    { itemId: 'equipment_box_gold', count: 3 }
                ]
            }
        },
        {
            rank: 3,
            minDamage: 3000000,
            rewards: {
                gold: 200000,
                soulCrystal: 2000,
                contribution: 2000,
                items: [
                    { itemId: 'boss_chest_legendary', count: 1 },
                    { itemId: 'equipment_box_gold', count: 2 }
                ]
            }
        },
        {
            rank: 10,
            minDamage: 1000000,
            rewards: {
                gold: 150000,
                soulCrystal: 1500,
                contribution: 1500,
                items: [
                    { itemId: 'boss_chest_epic', count: 3 },
                    { itemId: 'equipment_box_gold', count: 1 }
                ]
            }
        },
        {
            rank: 50,
            minDamage: 500000,
            rewards: {
                gold: 100000,
                soulCrystal: 1000,
                contribution: 1000,
                items: [
                    { itemId: 'boss_chest_epic', count: 2 }
                ]
            }
        },
        {
            rank: 100,
            minDamage: 100000,
            rewards: {
                gold: 80000,
                soulCrystal: 800,
                contribution: 800,
                items: [
                    { itemId: 'boss_chest_epic', count: 1 },
                    { itemId: 'boss_chest_rare', count: 2 }
                ]
            }
        },
        {
            rank: 999999,  // 参与奖
            minDamage: 0,
            rewards: {
                gold: 50000,
                soulCrystal: 500,
                contribution: 500,
                items: [
                    { itemId: 'boss_chest_rare', count: 1 }
                ]
            }
        }
    ];
    
    // 击杀奖励
    private killReward: WorldBossKillReward['killerRewards'] = {
        gold: 200000,
        soulCrystal: 2000,
        items: [
            { itemId: 'boss_chest_legendary', count: 1 },
            { itemId: 'killer_title_token', count: 1 }
        ],
        title: '终结者',
        specialFrame: 'boss_killer_frame'
    };
    
    /**
     * 发放世界BOSS奖励
     * @param bossId BOSS ID
     * @param bossName BOSS名称
     * @param rankings 伤害排行榜 [{playerId, damage, rank, isKiller}]
     * @param totalParticipants 总参与人数
     */
    public distributeRewards(
        bossId: string,
        bossName: string,
        rankings: {
            playerId: string;
            damage: number;
            rank: number;
            isKiller?: boolean;
        }[],
        totalParticipants: number
    ): {
        success: boolean;
        distributed: {
            killer: number;
            topRankers: number;
            participants: number;
        };
        errors: string[];
    } {
        const errors: string[] = [];
        let killerCount = 0;
        let topRankerCount = 0;
        let participantCount = 0;
        
        rankings.forEach(entry => {
            try {
                // 1. 发放击杀奖励
                if (entry.isKiller) {
                    const mailId = mailSender.sendWorldBossReward(
                        entry.playerId,
                        bossName,
                        entry.damage,
                        entry.rank,
                        true,
                        {
                            gold: this.killReward.gold,
                            soulCrystal: this.killReward.soulCrystal,
                            items: this.killReward.items,
                            title: this.killReward.title
                        }
                    );
                    logSystem.info('WorldBossReward', `Killer reward sent`, {
                        playerId: entry.playerId,
                        bossName,
                        mailId
                    });
                    killerCount++;
                }
                
                // 2. 发放排名奖励
                const rankReward = this.getRankReward(entry.rank, entry.damage);
                if (rankReward) {
                    const mailId = mailSender.sendWorldBossReward(
                        entry.playerId,
                        bossName,
                        entry.damage,
                        entry.rank,
                        false,
                        rankReward.rewards
                    );
                    logSystem.info('WorldBossReward', `Rank reward sent`, {
                        playerId: entry.playerId,
                        bossName,
                        rank: entry.rank,
                        mailId
                    });
                    topRankerCount++;
                }
                
                // 3. 发放参与奖励（如果没有排名奖励）
                if (!rankReward) {
                    const participationReward = this.getParticipationReward(entry.damage);
                    if (participationReward) {
                        const mailId = mailSender.sendWorldBossReward(
                            entry.playerId,
                            bossName,
                            entry.damage,
                            0, // 参与奖没有排名
                            false,
                            participationReward.rewards
                        );
                        logSystem.info('WorldBossReward', `Participation reward sent`, {
                            playerId: entry.playerId,
                            bossName,
                            mailId
                        });
                        participantCount++;
                    }
                }
            } catch (error) {
                errors.push(`Failed to send to ${entry.playerId}: ${error}`);
                logSystem.error('WorldBossReward', `Failed to send reward`, {
                    playerId: entry.playerId,
                    error
                });
            }
        });
        
        logSystem.info('WorldBossReward', `Distribution complete`, {
            bossName,
            killerCount,
            topRankerCount,
            participantCount
        });
        
        return {
            success: errors.length === 0,
            distributed: {
                killer: killerCount,
                topRankers: topRankerCount,
                participants: participantCount
            },
            errors
        };
    }
    
    /**
     * 获取排名奖励
     */
    private getRankReward(rank: number, damage: number): WorldBossRankReward | null {
        for (const tier of this.rankTiers) {
            if (rank <= tier.rank && damage >= tier.minDamage) {
                return tier;
            }
        }
        return null;
    }
    
    /**
     * 获取参与奖励
     */
    private getParticipationReward(damage: number): WorldBossParticipationReward | null {
        for (const tier of this.participationTiers) {
            if (damage >= tier.minDamage) {
                return tier;
            }
        }
        return null;
    }
    
    /**
     * 创建击杀奖励邮件
     */
    private createKillerMail(bossName: string, damage: number): Mail {
        const content = `恭喜您！\n\n` +
            `您对 ${bossName} 造成了致命一击！\n` +
            `最后一击伤害：${damage.toLocaleString()}\n\n` +
            `击杀奖励：\n` +
            `💰 金币 × ${this.killReward.gold.toLocaleString()}\n` +
            `💎 魂晶 × ${this.killReward.soulCrystal.toLocaleString()}\n` +
            `🏆 称号：${this.killReward.title}\n` +
            `🖼️ 专属头像框：${this.killReward.specialFrame}\n` +
            `📦 传奇BOSS宝箱 × ${this.killReward.items[0].count}\n\n` +
            `您的英勇表现将被所有玩家铭记！`;
        
        return {
            id: `WBR_KILL_${Date.now()}`,
            senderId: 'system',
            senderName: '世界BOSS系统',
            recipientId: '',
            title: `🗡️ ${bossName} 击杀奖励`,
            content,
            attachments: {
                gold: this.killReward.gold,
                soulCrystal: this.killReward.soulCrystal,
                items: this.killReward.items
            },
            priority: MailPriority.HIGH,
            isRead: false,
            isClaimed: false,
            createdAt: Date.now(),
            expireAt: Date.now() + 7 * 24 * 60 * 60 * 1000  // 7天过期
        };
    }
    
    /**
     * 创建排名奖励邮件
     */
    private createRankMail(
        bossName: string,
        rank: number,
        damage: number,
        reward: WorldBossRankReward,
        totalParticipants: number
    ): Mail {
        const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅';
        
        let content = `恭喜您在 ${bossName} 讨伐战中获得 ${rankEmoji} 第 ${rank} 名！\n\n`;
        content += `战斗数据：\n`;
        content += `造成伤害：${damage.toLocaleString()}\n`;
        content += `全服排名：${rank} / ${totalParticipants}\n`;
        content += `超越玩家：${((1 - rank / totalParticipants) * 100).toFixed(1)}%\n\n`;
        content += `排名奖励：\n`;
        content += `💰 金币 × ${reward.rewards.gold.toLocaleString()}\n`;
        content += `💎 魂晶 × ${reward.rewards.soulCrystal.toLocaleString()}\n`;
        content += `🏅 公会贡献 × ${reward.rewards.contribution.toLocaleString()}\n`;
        
        if (reward.rewards.items) {
            reward.rewards.items.forEach(item => {
                content += `📦 ${item.itemId} × ${item.count}\n`;
            });
        }
        
        if (reward.rewards.specialCard) {
            content += `🃏 限定卡牌：${reward.rewards.specialCard}\n`;
        }
        if (reward.rewards.title) {
            content += `🏆 称号：${reward.rewards.title}\n`;
        }
        
        content += '\n感谢您对守护世界做出的贡献！';
        
        return {
            id: `WBR_RANK_${Date.now()}_${rank}`,
            senderId: 'system',
            senderName: '世界BOSS系统',
            recipientId: '',
            title: `${rankEmoji} ${bossName} 讨伐战第${rank}名奖励`,
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
            expireAt: Date.now() + 7 * 24 * 60 * 60 * 1000
        };
    }
    
    /**
     * 创建参与奖励邮件
     */
    private createParticipationMail(
        bossName: string,
        damage: number,
        reward: WorldBossParticipationReward
    ): Mail {
        const content = `感谢您对 ${bossName} 讨伐战的参与！\n\n` +
            `您的贡献：\n` +
            `造成伤害：${damage.toLocaleString()}\n\n` +
            `参与奖励：\n` +
            `💰 金币 × ${reward.rewards.gold.toLocaleString()}\n` +
            `💎 魂晶 × ${reward.rewards.soulCrystal.toLocaleString()}\n` +
            `🏅 公会贡献 × ${reward.rewards.contribution?.toLocaleString() || 0}\n\n` +
            '下次讨伐战期待您的表现！';
        
        return {
            id: `WBR_PART_${Date.now()}`,
            senderId: 'system',
            senderName: '世界BOSS系统',
            recipientId: '',
            title: `${bossName} 讨伐战参与奖励`,
            content,
            attachments: {
                gold: reward.rewards.gold,
                soulCrystal: reward.rewards.soulCrystal
            },
            priority: MailPriority.LOW,
            isRead: false,
            isClaimed: false,
            createdAt: Date.now(),
            expireAt: Date.now() + 3 * 24 * 60 * 60 * 1000  // 3天过期
        };
    }
    
    /**
     * 手动发放补偿（用于BOSS异常等情况）
     */
    public manualCompensation(
        playerId: string,
        bossName: string,
        reason: string,
        compensation: { gold?: number; soulCrystal?: number; items?: { itemId: string; count: number }[] }
    ): string {
        const mailId = mailSender.sendCompensation(
            playerId,
            `${bossName} - ${reason}`,
            compensation
        );
        
        logSystem.info('WorldBossReward', `Manual compensation sent`, {
            playerId,
            bossName,
            reason,
            mailId
        });
        
        return mailId;
    }
}

// 单例
export const worldBossRewardDistributor = new WorldBossRewardDistributor();
