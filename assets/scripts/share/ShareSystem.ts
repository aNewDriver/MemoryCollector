/**
 * 社交分享系统
 * 邀请好友、分享成就、推广奖励
 */

export enum ShareType {
    BATTLE_RESULT = 'battle_result',   // 战斗结果
    CARD_COLLECTION = 'card_collection', // 卡牌收集
    ACHIEVEMENT = 'achievement',       // 成就
    INVITE = 'invite',                 // 邀请好友
    RANKING = 'ranking'                // 排行榜
}

export interface ShareTemplate {
    id: string;
    type: ShareType;
    title: string;
    description: string;
    image: string;
    
    // 动态内容占位符
    placeholders: string[];
}

export interface InviteRecord {
    inviterId: string;
    inviteeId: string;
    inviteCode: string;
    invitedAt: number;
    rewardsClaimed: boolean;
}

export class ShareSystem {
    private templates: Map<string, ShareTemplate> = new Map();
    private inviteRecords: Map<string, InviteRecord[]> = new Map();  // inviterId -> records
    private inviteCodes: Map<string, string> = new Map();  // inviteeId -> inviterId
    
    constructor() {
        this.initializeTemplates();
    }
    
    private initializeTemplates(): void {
        const templates: ShareTemplate[] = [
            {
                id: 'share_battle_win',
                type: ShareType.BATTLE_RESULT,
                title: '战斗胜利！',
                description: '我刚刚击败了强大的对手，快来挑战我吧！',
                image: 'share/battle_win.bmp',
                placeholders: ['opponent', 'rounds']
            },
            {
                id: 'share_new_card',
                type: ShareType.CARD_COLLECTION,
                title: '新卡牌获得！',
                description: '我抽到了稀有卡牌 {cardName}！',
                image: 'share/new_card.bmp',
                placeholders: ['cardName', 'cardRarity']
            },
            {
                id: 'share_achievement',
                type: ShareType.ACHIEVEMENT,
                title: '达成成就！',
                description: '我刚刚达成了 {achievementName} 成就！',
                image: 'share/achievement.bmp',
                placeholders: ['achievementName']
            },
            {
                id: 'share_invite',
                type: ShareType.INVITE,
                title: '邀请你加入',
                description: '快来加入《记忆回收者》，和我一起玩吧！使用我的邀请码：{inviteCode}',
                image: 'share/invite.bmp',
                placeholders: ['inviteCode']
            },
            {
                id: 'share_ranking',
                type: ShareType.RANKING,
                title: '排行榜新高！',
                description: '我在 {rankingType} 中排名第 {rank}！',
                image: 'share/ranking.bmp',
                placeholders: ['rankingType', 'rank']
            }
        ];
        
        templates.forEach(t => this.templates.set(t.id, t));
    }
    
    // 生成邀请码
    public generateInviteCode(playerId: string): string {
        const code = `INV${playerId.substr(0, 6).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        return code;
    }
    
    // 使用邀请码
    public useInviteCode(inviteeId: string, inviteCode: string): {
        success: boolean;
        inviterId?: string;
        error?: string;
    } {
        // 解析邀请码获取邀请人ID
        const inviterId = this.parseInviteCode(inviteCode);
        if (!inviterId) {
            return { success: false, error: '无效的邀请码' };
        }
        
        if (inviterId === inviteeId) {
            return { success: false, error: '不能使用自己的邀请码' };
        }
        
        // 检查是否已被邀请过
        if (this.inviteCodes.has(inviteeId)) {
            return { success: false, error: '你已经接受过邀请' };
        }
        
        // 记录邀请关系
        const record: InviteRecord = {
            inviterId,
            inviteeId,
            inviteCode,
            invitedAt: Date.now(),
            rewardsClaimed: false
        };
        
        if (!this.inviteRecords.has(inviterId)) {
            this.inviteRecords.set(inviterId, []);
        }
        this.inviteRecords.get(inviterId)!.push(record);
        
        this.inviteCodes.set(inviteeId, inviterId);
        
        return { success: true, inviterId };
    }
    
    // 解析邀请码
    private parseInviteCode(code: string): string | null {
        // 简化的解析逻辑，实际应更复杂
        if (code.startsWith('INV') && code.length === 13) {
            return code.substr(3, 6).toLowerCase();
        }
        return null;
    }
    
    // 领取邀请奖励
    public claimInviteReward(inviterId: string, inviteeId: string): {
        success: boolean;
        rewards?: any;
        error?: string;
    } {
        const records = this.inviteRecords.get(inviterId);
        if (!records) return { success: false, error: '无邀请记录' };
        
        const record = records.find(r => r.inviteeId === inviteeId);
        if (!record) return { success: false, error: '邀请记录不存在' };
        
        if (record.rewardsClaimed) {
            return { success: false, error: '奖励已领取' };
        }
        
        record.rewardsClaimed = true;
        
        return {
            success: true,
            rewards: {
                soulCrystal: 100,
                gold: 50000
            }
        };
    }
    
    // 获取邀请列表
    public getInviteList(playerId: string): InviteRecord[] {
        return this.inviteRecords.get(playerId) || [];
    }
    
    // 获取邀请统计
    public getInviteStats(playerId: string): {
        totalInvited: number;
        rewardsClaimed: number;
        pendingRewards: number;
    } {
        const records = this.inviteRecords.get(playerId) || [];
        
        return {
            totalInvited: records.length,
            rewardsClaimed: records.filter(r => r.rewardsClaimed).length,
            pendingRewards: records.filter(r => !r.rewardsClaimed).length
        };
    }
    
    // 生成分享内容
    public generateShareContent(
        templateId: string,
        data: Record<string, string>
    ): {
        title: string;
        description: string;
        image: string;
    } | null {
        const template = this.templates.get(templateId);
        if (!template) return null;
        
        let title = template.title;
        let description = template.description;
        
        // 替换占位符
        template.placeholders.forEach(placeholder => {
            const value = data[placeholder] || '';
            title = title.replace(`{${placeholder}}`, value);
            description = description.replace(`{${placeholder}}`, value);
        });
        
        return {
            title,
            description,
            image: template.image
        };
    }
    
    // 分享到平台
    public async shareToPlatform(
        platform: 'wechat' | 'qq' | 'weibo' | 'clipboard',
        content: { title: string; description: string; image: string }
    ): Promise<boolean> {
        // TODO: 实际的平台分享API调用
        console.log(`分享到 ${platform}:`, content);
        
        // 模拟成功
        return new Promise(resolve => {
            setTimeout(() => resolve(true), 500);
        });
    }
    
    // 获取分享模板
    public getTemplates(type?: ShareType): ShareTemplate[] {
        const templates = Array.from(this.templates.values());
        if (type) {
            return templates.filter(t => t.type === type);
        }
        return templates;
    }
    
    // 记录分享行为
    public recordShare(playerId: string, templateId: string, platform: string): void {
        console.log(`玩家 ${playerId} 分享了 ${templateId} 到 ${platform}`);
        // TODO: 存储分享记录，用于分析
    }
}

// 单例
export const shareSystem = new ShareSystem();
