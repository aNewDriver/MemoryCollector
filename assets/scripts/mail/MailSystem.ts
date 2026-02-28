/**
 * 邮件系统
 * 接收奖励、系统通知、活动邮件
 */

export enum MailType {
    REWARD = 'reward',       // 奖励邮件
    SYSTEM = 'system',       // 系统通知
    EVENT = 'event',         // 活动邮件
    GUILD = 'guild',         // 公会邮件
    BATTLE = 'battle'        // 战斗报告
}

export interface MailAttachment {
    type: 'gold' | 'soulCrystal' | 'item' | 'card' | 'equipment';
    itemId?: string;
    count: number;
}

export interface Mail {
    id: string;
    type: MailType;
    sender: string;
    title: string;
    content: string;
    attachments: MailAttachment[];
    
    // 时间
    sendTime: number;
    expireTime: number;  // 过期时间
    
    // 状态
    isRead: boolean;
    isClaimed: boolean;
    
    // 是否重要（不会自动删除）
    isImportant: boolean;
}

export class MailSystem {
    private mails: Map<string, Mail> = new Map();
    private maxMailCount: number = 100;
    private defaultExpireDays: number = 30;
    
    // 发送邮件
    public sendMail(
        type: MailType,
        toPlayerId: string,
        sender: string,
        title: string,
        content: string,
        attachments: MailAttachment[] = [],
        isImportant: boolean = false
    ): string {
        const mailId = `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const mail: Mail = {
            id: mailId,
            type,
            sender,
            title,
            content,
            attachments,
            sendTime: Date.now(),
            expireTime: isImportant 
                ? Date.now() + 365 * 24 * 60 * 60 * 1000  // 重要邮件1年
                : Date.now() + this.defaultExpireDays * 24 * 60 * 60 * 1000,
            isRead: false,
            isClaimed: false,
            isImportant
        };
        
        this.mails.set(mailId, mail);
        
        // 清理过期邮件
        this.cleanExpiredMails();
        
        // 限制邮件数量
        this.limitMailCount();
        
        return mailId;
    }
    
    // 获取邮件列表
    public getMails(
        type?: MailType,
        onlyUnread: boolean = false
    ): Mail[] {
        let mails = Array.from(this.mails.values());
        
        // 过滤类型
        if (type) {
            mails = mails.filter(m => m.type === type);
        }
        
        // 过滤未读
        if (onlyUnread) {
            mails = mails.filter(m => !m.isRead);
        }
        
        // 按时间排序（新的在前）
        return mails.sort((a, b) => b.sendTime - a.sendTime);
    }
    
    // 获取单封邮件
    public getMail(mailId: string): Mail | null {
        return this.mails.get(mailId) || null;
    }
    
    // 阅读邮件
    public readMail(mailId: string): boolean {
        const mail = this.mails.get(mailId);
        if (!mail) return false;
        
        mail.isRead = true;
        return true;
    }
    
    // 领取附件
    public claimAttachments(mailId: string): {
        success: boolean;
        attachments?: MailAttachment[];
        error?: string;
    } {
        const mail = this.mails.get(mailId);
        if (!mail) {
            return { success: false, error: '邮件不存在' };
        }
        
        if (mail.isClaimed) {
            return { success: false, error: '已领取' };
        }
        
        if (mail.attachments.length === 0) {
            return { success: false, error: '没有附件' };
        }
        
        mail.isClaimed = true;
        mail.isRead = true;
        
        return { success: true, attachments: mail.attachments };
    }
    
    // 删除邮件
    public deleteMail(mailId: string): boolean {
        return this.mails.delete(mailId);
    }
    
    // 批量删除已领取的邮件
    public deleteClaimedMails(): number {
        let count = 0;
        this.mails.forEach((mail, id) => {
            if (mail.isClaimed && !mail.isImportant) {
                this.mails.delete(id);
                count++;
            }
        });
        return count;
    }
    
    // 获取未读邮件数
    public getUnreadCount(): number {
        return Array.from(this.mails.values()).filter(m => !m.isRead).length;
    }
    
    // 获取有附件未领取的邮件数
    public getUnclaimedCount(): number {
        return Array.from(this.mails.values()).filter(
            m => m.attachments.length > 0 && !m.isClaimed
        ).length;
    }
    
    // 发送系统奖励邮件（便捷方法）
    public sendRewardMail(
        toPlayerId: string,
        title: string,
        content: string,
        rewards: MailAttachment[]
    ): string {
        return this.sendMail(
            MailType.REWARD,
            toPlayerId,
            '系统',
            title,
            content,
            rewards
        );
    }
    
    // 发送战斗报告
    public sendBattleReport(
        toPlayerId: string,
        battleType: string,
        result: 'win' | 'lose',
        rewards: MailAttachment[]
    ): string {
        const title = result === 'win' ? `${battleType}胜利！` : `${battleType}失败`;
        const content = result === 'win' 
            ? `恭喜您在${battleType}中取得胜利！奖励已发放，请查收。`
            : `很遗憾，您在${battleType}中未能获胜。再接再厉！`;
        
        return this.sendMail(
            MailType.BATTLE,
            toPlayerId,
            '战斗报告',
            title,
            content,
            rewards
        );
    }
    
    // 清理过期邮件
    private cleanExpiredMails(): void {
        const now = Date.now();
        this.mails.forEach((mail, id) => {
            if (!mail.isImportant && mail.expireTime < now) {
                this.mails.delete(id);
            }
        });
    }
    
    // 限制邮件数量
    private limitMailCount(): void {
        if (this.mails.size <= this.maxMailCount) return;
        
        // 获取非重要邮件，按时间排序
        const nonImportantMails = Array.from(this.mails.entries())
            .filter(([_, mail]) => !mail.isImportant)
            .sort((a, b) => a[1].sendTime - b[1].sendTime);
        
        // 删除最老的邮件
        const toDelete = this.mails.size - this.maxMailCount;
        for (let i = 0; i < toDelete && i < nonImportantMails.length; i++) {
            this.mails.delete(nonImportantMails[i][0]);
        }
    }
    
    // 获取邮件统计
    public getStats(): {
        total: number;
        unread: number;
        unclaimed: number;
    } {
        const mails = Array.from(this.mails.values());
        return {
            total: mails.length,
            unread: mails.filter(m => !m.isRead).length,
            unclaimed: mails.filter(m => m.attachments.length > 0 && !m.isClaimed).length
        };
    }
}

// 单例
export const mailSystem = new MailSystem();
