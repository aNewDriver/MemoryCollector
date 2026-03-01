/**
 * 邮件发送器
 * 连接各系统与邮件系统，实现奖励自动发放
 */

import { mailSystem, MailAttachment } from '../mail/MailSystem';
import { logSystem } from '../log/LogSystem';

export class MailSender {
    private static instance: MailSender;
    
    static getInstance(): MailSender {
        if (!MailSender.instance) {
            MailSender.instance = new MailSender();
        }
        return MailSender.instance;
    }
    
    /**
     * 发送排行榜奖励邮件
     */
    public sendLeaderboardReward(
        playerId: string,
        leaderboardType: string,
        rank: number,
        rewards: {
            gold?: number;
            soulCrystal?: number;
            items?: { itemId: string; count: number }[];
            title?: string;
            frame?: string;
        }
    ): string {
        const rankText = this.getRankText(rank);
        const title = `${leaderboardType} ${rankText} 奖励`;
        
        let content = `恭喜您在${leaderboardType}中获得 ${rankText}！\n\n`;
        content += '奖励内容：\n';
        
        const attachments: MailAttachment[] = [];
        
        if (rewards.gold) {
            content += `💰 金币 × ${rewards.gold.toLocaleString()}\n`;
            attachments.push({ type: 'gold', count: rewards.gold });
        }
        if (rewards.soulCrystal) {
            content += `💎 魂晶 × ${rewards.soulCrystal.toLocaleString()}\n`;
            attachments.push({ type: 'soulCrystal', count: rewards.soulCrystal });
        }
        if (rewards.items) {
            rewards.items.forEach(item => {
                content += `📦 ${item.itemId} × ${item.count}\n`;
                attachments.push({ type: 'item', itemId: item.itemId, count: item.count });
            });
        }
        if (rewards.title) {
            content += `🏆 称号：${rewards.title}\n`;
        }
        if (rewards.frame) {
            content += `🖼️ 头像框：${rewards.frame}\n`;
        }
        
        content += '\n感谢您的参与，祝您游戏愉快！';
        
        const mailId = mailSystem.sendRewardMail(playerId, title, content, attachments);
        
        logSystem.info('MailSender', `Leaderboard reward sent`, {
            playerId,
            leaderboardType,
            rank,
            mailId
        });
        
        return mailId;
    }
    
    /**
     * 发送世界BOSS奖励邮件
     */
    public sendWorldBossReward(
        playerId: string,
        bossName: string,
        damage: number,
        rank: number,
        isKiller: boolean,
        rewards: {
            gold: number;
            soulCrystal: number;
            contribution?: number;
            items?: { itemId: string; count: number }[];
            specialCard?: string;
            title?: string;
        }
    ): string {
        let title: string;
        let content: string;
        
        if (isKiller) {
            title = `🗡️ ${bossName} 击杀奖励`;
            content = `恭喜您！\n\n`;
            content += `您对 ${bossName} 造成了致命一击！\n`;
            content += `最后一击伤害：${damage.toLocaleString()}\n\n`;
            content += '击杀奖励：\n';
        } else {
            const rankEmoji = rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : '🏅';
            title = `${rankEmoji} ${bossName} 讨伐战第${rank}名奖励`;
            content = `恭喜您在 ${bossName} 讨伐战中获得 ${rankEmoji} 第 ${rank} 名！\n\n`;
            content += `造成伤害：${damage.toLocaleString()}\n\n`;
            content += '排名奖励：\n';
        }
        
        const attachments: MailAttachment[] = [];
        
        content += `💰 金币 × ${rewards.gold.toLocaleString()}\n`;
        attachments.push({ type: 'gold', count: rewards.gold });
        
        content += `💎 魂晶 × ${rewards.soulCrystal.toLocaleString()}\n`;
        attachments.push({ type: 'soulCrystal', count: rewards.soulCrystal });
        
        if (rewards.contribution) {
            content += `🏅 公会贡献 × ${rewards.contribution.toLocaleString()}\n`;
        }
        
        if (rewards.items) {
            rewards.items.forEach(item => {
                content += `📦 ${item.itemId} × ${item.count}\n`;
                attachments.push({ type: 'item', itemId: item.itemId, count: item.count });
            });
        }
        
        if (rewards.specialCard) {
            content += `🃏 限定卡牌：${rewards.specialCard}\n`;
            attachments.push({ type: 'card', itemId: rewards.specialCard, count: 1 });
        }
        
        if (rewards.title) {
            content += `🏆 称号：${rewards.title}\n`;
        }
        
        content += '\n感谢您对守护世界做出的贡献！';
        
        const mailId = mailSystem.sendRewardMail(playerId, title, content, attachments);
        
        logSystem.info('MailSender', `WorldBoss reward sent`, {
            playerId,
            bossName,
            rank,
            isKiller,
            mailId
        });
        
        return mailId;
    }
    
    /**
     * 发送反作弊处罚通知
     */
    public sendPunishmentNotice(
        playerId: string,
        type: 'warning' | 'mute' | 'suspend' | 'ban',
        reason: string,
        duration?: string
    ): string {
        const typeNames: Record<string, string> = {
            warning: '警告',
            mute: '禁言',
            suspend: '封号',
            ban: '永久封号'
        };
        
        const title = `【系统】${typeNames[type]}通知`;
        let content = `亲爱的玩家：\n\n`;
        content += `由于您${reason}，我们已对您进行${typeNames[type]}处理。\n\n`;
        
        if (duration) {
            content += `处罚时长：${duration}\n`;
        }
        
        content += '请您遵守游戏规则，共同维护良好的游戏环境。\n\n';
        content += '如有疑问，请联系客服进行申诉。';
        
        const mailId = mailSystem.sendMail(
            'system' as any,
            playerId,
            '系统',
            title,
            content,
            [],
            true  // 重要邮件
        );
        
        logSystem.info('MailSender', `Punishment notice sent`, {
            playerId,
            type,
            reason,
            mailId
        });
        
        return mailId;
    }
    
    /**
     * 发送补偿邮件
     */
    public sendCompensation(
        playerId: string,
        reason: string,
        rewards: {
            gold?: number;
            soulCrystal?: number;
            items?: { itemId: string; count: number }[];
        }
    ): string {
        const title = '【补偿】系统维护补偿';
        let content = '亲爱的玩家：\n\n';
        content += `由于${reason}，我们向您发放以下补偿：\n\n`;
        
        const attachments: MailAttachment[] = [];
        
        if (rewards.gold) {
            content += `💰 金币 × ${rewards.gold.toLocaleString()}\n`;
            attachments.push({ type: 'gold', count: rewards.gold });
        }
        if (rewards.soulCrystal) {
            content += `💎 魂晶 × ${rewards.soulCrystal.toLocaleString()}\n`;
            attachments.push({ type: 'soulCrystal', count: rewards.soulCrystal });
        }
        if (rewards.items) {
            rewards.items.forEach(item => {
                content += `📦 ${item.itemId} × ${item.count}\n`;
                attachments.push({ type: 'item', itemId: item.itemId, count: item.count });
            });
        }
        
        content += '\n感谢您的理解与支持！';
        
        const mailId = mailSystem.sendRewardMail(playerId, title, content, attachments);
        
        logSystem.info('MailSender', `Compensation sent`, {
            playerId,
            reason,
            mailId
        });
        
        return mailId;
    }
    
    /**
     * 发送活动奖励
     */
    public sendEventReward(
        playerId: string,
        eventName: string,
        rewards: MailAttachment[]
    ): string {
        const title = `【活动】${eventName}奖励`;
        const content = `恭喜您在${eventName}中达成目标！\n\n奖励已发放至附件，请及时领取。`;
        
        const mailId = mailSystem.sendRewardMail(playerId, title, content, rewards);
        
        logSystem.info('MailSender', `Event reward sent`, {
            playerId,
            eventName,
            mailId
        });
        
        return mailId;
    }
    
    /**
     * 发送公会战奖励
     */
    public sendGuildWarReward(
        playerId: string,
        result: 'win' | 'lose' | 'draw',
        rank: number,
        rewards: MailAttachment[]
    ): string {
        const resultText = { win: '胜利', lose: '失败', draw: '平局' }[result];
        const title = `【公会战】${resultText}奖励`;
        
        let content = `本次公会战已结束，您的公会获得${resultText}！\n\n`;
        content += `公会排名：第${rank}名\n`;
        content += '根据您的表现，获得以下奖励：\n';
        
        const mailId = mailSystem.sendRewardMail(playerId, title, content, rewards);
        
        logSystem.info('MailSender', `Guild war reward sent`, {
            playerId,
            result,
            rank,
            mailId
        });
        
        return mailId;
    }
    
    /**
     * 获取排名文字描述
     */
    private getRankText(rank: number): string {
        if (rank === 1) return '🥇 冠军';
        if (rank === 2) return '🥈 亚军';
        if (rank === 3) return '🥉 季军';
        return `第 ${rank} 名`;
    }
}

// 单例导出
export const mailSender = MailSender.getInstance();
