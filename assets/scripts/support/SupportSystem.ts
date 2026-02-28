/**
 * 客服和反馈系统
 * 玩家问题提交、FAQ、工单管理
 */

export enum TicketCategory {
    ACCOUNT = 'account',       // 账号问题
    PAYMENT = 'payment',       // 支付问题
    BUG = 'bug',               // 游戏BUG
    SUGGESTION = 'suggestion', // 建议
    OTHER = 'other'            // 其他
}

export enum TicketStatus {
    OPEN = 'open',             // 待处理
    IN_PROGRESS = 'in_progress', // 处理中
    WAITING_REPLY = 'waiting_reply', // 等待玩家回复
    RESOLVED = 'resolved',     // 已解决
    CLOSED = 'closed'          // 已关闭
}

export interface Ticket {
    id: string;
    playerId: string;
    category: TicketCategory;
    title: string;
    content: string;
    status: TicketStatus;
    createdAt: number;
    updatedAt: number;
    
    // 回复记录
    replies: TicketReply[];
    
    // 优先级
    priority: 'low' | 'normal' | 'high' | 'urgent';
    
    // 附件
    attachments?: string[];
}

export interface TicketReply {
    id: string;
    isStaff: boolean;
    authorId: string;
    content: string;
    timestamp: number;
    attachments?: string[];
}

export interface FAQ {
    id: string;
    category: TicketCategory;
    question: string;
    answer: string;
    views: number;
    isHot: boolean;
}

export class SupportSystem {
    private tickets: Map<string, Ticket> = new Map();
    private playerTickets: Map<string, string[]> = new Map();  // playerId -> ticketIds
    private faqs: Map<string, FAQ> = new Map();
    
    constructor() {
        this.initializeFAQs();
    }
    
    private initializeFAQs(): void {
        const defaultFAQs: FAQ[] = [
            {
                id: 'faq_1',
                category: TicketCategory.ACCOUNT,
                question: '如何绑定账号？',
                answer: '进入设置-账号管理，选择绑定方式（手机/邮箱/第三方）即可完成绑定。',
                views: 1000,
                isHot: true
            },
            {
                id: 'faq_2',
                category: TicketCategory.PAYMENT,
                question: '充值未到账怎么办？',
                answer: '请耐心等待5-10分钟。如仍未到账，请提供订单截图和角色ID联系客服。',
                views: 2500,
                isHot: true
            },
            {
                id: 'faq_3',
                category: TicketCategory.BUG,
                question: '游戏闪退如何解决？',
                answer: '请尝试：1.清理缓存 2.重启设备 3.检查存储空间 4.更新到最新版本',
                views: 800,
                isHot: false
            },
            {
                id: 'faq_4',
                category: TicketCategory.ACCOUNT,
                question: '忘记密码怎么办？',
                answer: '在登录界面点击"忘记密码"，通过绑定的手机或邮箱重置密码。',
                views: 1200,
                isHot: true
            },
            {
                id: 'faq_5',
                category: TicketCategory.SUGGESTION,
                question: '如何提交游戏建议？',
                answer: '点击主界面右上角设置-反馈建议，填写您的宝贵意见。',
                views: 300,
                isHot: false
            }
        ];
        
        defaultFAQs.forEach(faq => this.faqs.set(faq.id, faq));
    }
    
    // 创建工单
    public createTicket(
        playerId: string,
        category: TicketCategory,
        title: string,
        content: string,
        attachments?: string[]
    ): { success: boolean; ticketId?: string; error?: string } {
        // 检查玩家是否有大量未关闭工单
        const existingTickets = this.getPlayerTickets(playerId);
        const openCount = existingTickets.filter(t => 
            t.status !== TicketStatus.RESOLVED && t.status !== TicketStatus.CLOSED
        ).length;
        
        if (openCount >= 5) {
            return { success: false, error: '您有太多未处理的工单，请等待处理完成后再提交' };
        }
        
        const ticketId = `TKT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const ticket: Ticket = {
            id: ticketId,
            playerId,
            category,
            title,
            content,
            status: TicketStatus.OPEN,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            replies: [],
            priority: this.calculatePriority(category),
            attachments
        };
        
        this.tickets.set(ticketId, ticket);
        
        // 关联到玩家
        if (!this.playerTickets.has(playerId)) {
            this.playerTickets.set(playerId, []);
        }
        this.playerTickets.get(playerId)!.push(ticketId);
        
        return { success: true, ticketId };
    }
    
    // 计算优先级
    private calculatePriority(category: TicketCategory): Ticket['priority'] {
        switch (category) {
            case TicketCategory.PAYMENT:
                return 'high';
            case TicketCategory.BUG:
                return 'normal';
            case TicketCategory.ACCOUNT:
                return 'high';
            default:
                return 'low';
        }
    }
    
    // 回复工单
    public replyTicket(
        ticketId: string,
        isStaff: boolean,
        authorId: string,
        content: string,
        attachments?: string[]
    ): { success: boolean; error?: string } {
        const ticket = this.tickets.get(ticketId);
        if (!ticket) return { success: false, error: '工单不存在' };
        
        if (ticket.status === TicketStatus.CLOSED) {
            return { success: false, error: '工单已关闭' };
        }
        
        const reply: TicketReply = {
            id: `RPL_${Date.now()}`,
            isStaff,
            authorId,
            content,
            timestamp: Date.now(),
            attachments
        };
        
        ticket.replies.push(reply);
        ticket.updatedAt = Date.now();
        
        // 更新状态
        if (isStaff) {
            ticket.status = TicketStatus.WAITING_REPLY;
        } else {
            ticket.status = TicketStatus.IN_PROGRESS;
        }
        
        return { success: true };
    }
    
    // 关闭工单
    public closeTicket(ticketId: string): boolean {
        const ticket = this.tickets.get(ticketId);
        if (!ticket) return false;
        
        ticket.status = TicketStatus.CLOSED;
        ticket.updatedAt = Date.now();
        return true;
    }
    
    // 标记为已解决
    public resolveTicket(ticketId: string): boolean {
        const ticket = this.tickets.get(ticketId);
        if (!ticket) return false;
        
        ticket.status = TicketStatus.RESOLVED;
        ticket.updatedAt = Date.now();
        return true;
    }
    
    // 获取工单
    public getTicket(ticketId: string): Ticket | null {
        return this.tickets.get(ticketId) || null;
    }
    
    // 获取玩家所有工单
    public getPlayerTickets(playerId: string): Ticket[] {
        const ticketIds = this.playerTickets.get(playerId) || [];
        return ticketIds
            .map(id => this.tickets.get(id))
            .filter((t): t is Ticket => t !== undefined)
            .sort((a, b) => b.createdAt - a.createdAt);
    }
    
    // 获取待回复工单
    public getPendingTickets(): Ticket[] {
        return Array.from(this.tickets.values())
            .filter(t => t.status === TicketStatus.OPEN || t.status === TicketStatus.WAITING_REPLY)
            .sort((a, b) => {
                // 按优先级排序
                const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
    }
    
    // 获取FAQ列表
    public getFAQs(category?: TicketCategory): FAQ[] {
        let faqs = Array.from(this.faqs.values());
        
        if (category) {
            faqs = faqs.filter(f => f.category === category);
        }
        
        // 热门优先
        return faqs.sort((a, b) => {
            if (a.isHot && !b.isHot) return -1;
            if (!a.isHot && b.isHot) return 1;
            return b.views - a.views;
        });
    }
    
    // 获取FAQ详情
    public getFAQ(faqId: string): FAQ | null {
        const faq = this.faqs.get(faqId);
        if (faq) {
            faq.views++;
        }
        return faq || null;
    }
    
    // 搜索FAQ
    public searchFAQs(keyword: string): FAQ[] {
        const lowerKeyword = keyword.toLowerCase();
        return Array.from(this.faqs.values()).filter(f =>
            f.question.toLowerCase().includes(lowerKeyword) ||
            f.answer.toLowerCase().includes(lowerKeyword)
        );
    }
    
    // 添加快捷反馈
    public sendQuickFeedback(
        playerId: string,
        type: 'like' | 'dislike' | 'bug',
        content?: string
    ): void {
        console.log(`[Feedback] ${type} from ${playerId}: ${content || ''}`);
        // TODO: 存储到数据库
    }
}

// 单例
export const supportSystem = new SupportSystem();
